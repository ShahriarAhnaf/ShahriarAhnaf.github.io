---
title: "The interrupt had already happened. Why was the CPU still waiting?"
date: "2026-09-06"
description: "Tracing an nRF52 firmware hang to a missing ARM event-register update in Renode, and following the report through an upstream fix."
draft: true
---

A CPU can get stuck waiting for something that has already happened.

That was the failure behind a bug I reported while working on Nordic nRF52 firmware in Renode. An interrupt handler ran, updated a flag in memory, and returned. The program then reached `WFE`, an ARM instruction meaning “wait for event,” and stopped before it could read the flag.

The work was done. The program could not get far enough to notice.

I [reported the issue in March 2026](https://github.com/renode/renode/issues/892). In August, the Renode maintainers reproduced it, implemented a fix, and added a regression test. This post records the mechanism and the part of the investigation worth reusing.

## Two kinds of state

An interrupt is a way for a peripheral to get the processor's attention. The CPU runs an interrupt service routine, or ISR, then returns to the code it interrupted.

A common arrangement gives the ISR a small job: acknowledge the peripheral and set a flag. The main program waits until that flag says there is work to process.

There are two separate pieces of state here:

- **The application flag:** a value in RAM that the firmware reads.
- **The event register:** processor state that determines whether `WFE` can proceed immediately.

Setting the first does not automatically model the second. An emulator has to maintain both.

For the ARMv7-M behavior at issue, exception return sets the event register. A subsequent `WFE` consumes that event and continues. The important detail is that the event can still matter after the interrupt handler has finished. [My report describes the sequence and cites the architecture reference.](https://github.com/renode/renode/issues/892)

## The ordering that exposed the bug

Imagine this timeline:

| Step | Firmware or CPU action | State that matters |
| --- | --- | --- |
| 1 | A peripheral triggers an interrupt | Work is ready |
| 2 | Its handler sets the RAM flag | The application can proceed |
| 3 | The handler returns | The event register should record an event |
| 4 | Main code executes `WFE` | It should consume that event |
| 5 | Main code reads the flag | It sees the completed work |

The failing model lost the state transition at step 3. By step 4, there was no pending interrupt left to rescue it. The flag was correct, but execution stopped before the load that would read it.

This is why “the interrupt fired” is an incomplete debugging result. The next questions are: when did it fire, did the handler finish, and what processor state survived the return?

In my report, the concrete path was `SaSi_HalWaitInterrupt` in the CryptoCell CC310 library used with Nordic SoftDevice firmware. The small architectural omission surfaced much farther up the stack as a firmware hang. [Reproduction details](https://github.com/renode/renode/issues/892).

## My patch and the upstream outcome

I proposed a tlib patch that updated the event state around exception handling and added an early return in the WFE helper when an event was already recorded. The [proposed diff remains available](https://github.com/antmicro/tlib/pull/23/files).

The maintainers then implemented their own fix, including broader changes to wakeup-state handling. They confirmed that their test failed before the change and passed afterward. My contribution here was the report, diagnosis, and proposed patch; my PR itself was closed without being merged after the upstream fix became available. [Maintainer response](https://github.com/renode/renode/issues/892#issuecomment-5452075390).

That distinction belongs in the record. It also gives someone debugging a similar problem the right thing to follow: the upstream implementation, not an assumption that my original diff is what shipped.

## A small experiment to understand it

You do not need a complete Bluetooth application to study this failure. The useful experiment separates “the interrupt happened” from “WFE observed the resulting event.”

1. Arrange for a timer interrupt to set a flag.
2. Wait until the flag proves that the handler ran.
3. Execute `WFE` after the handler has returned.
4. Check that execution reaches a visible marker afterward.

This describes the intent of the [upstream nRF52840 regression test](https://github.com/renode/renode/commit/33e77808c5a2f861607beb9199d2e21e6aae4632). It is an experiment outline, not a complete board program; the interrupt setup and unrelated wakeup sources need to be controlled.

The broader habit is useful even outside emulation: write down the order of events before changing the code. A flag, an interrupt, and a wakeup are related, but they are not interchangeable evidence.

## Work record

- **March 2026:** reported the missing event-register behavior and proposed [tlib PR #23](https://github.com/antmicro/tlib/pull/23).
- **August 28, 2026:** maintainers confirmed reproduction and pointed to the [upstream fix](https://github.com/renode/renode/commit/f515a43520ac33bc6c506397c41406db3b22eea9) and regression test.
- **September 6, 2026:** assembled this explanation from the public issue, patch, and resolution.

<!-- Author review: add a real debugger trace or screenshot from your investigation if you have one. The upstream test result is attributed to its maintainers; this draft does not claim it was rerun for the article. -->
