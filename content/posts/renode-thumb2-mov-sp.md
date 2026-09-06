---
title: "One register check between a firmware binary and a UsageFault"
date: "2026-09-06"
description: "Investigating MOV.W R0, SP in Renode's Thumb-2 decoder, with a small reproduction and a still-open compatibility patch."
draft: true
---

The instruction was a register move. The simulator treated it as a fault.

While working on Nordic SoftDevice S140 simulation, I ran into the Thumb-2 encoding `EA4F 000D`, used for `MOV.W R0, SP`. The binary wanted to copy the stack pointer into R0. Renode's tlib decoder rejected the source register before the move could execute. [Original report](https://github.com/renode/renode/issues/884).

The proposed code change was small. Deciding what it meant required a more careful question: which behavior should a simulator choose for an instruction encoding the architecture labels `UNPREDICTABLE`?

**Status, September 6, 2026:** [my upstream PR #20](https://github.com/antmicro/tlib/pull/20) is still open. This is a record of the investigation and proposed behavior, not a claim that the patch has landed.

## Start with the instruction bytes

A disassembly gives an instruction a readable name. The decoder has to work with its bits.

Here, `R0` is a general-purpose register and `SP` is the stack pointer, also identified as register 13 in this decoder path. The intended copy is easy to describe:

```text
R0 receives the current stack-pointer value.
```

The encoding details matter because different encodings can sit behind similar assembly syntax. My report breaks this one down as:

| Field | Value in the reproduction |
| --- | --- |
| First halfword | `0xEA4F` |
| Second halfword | `0x000D` |
| Source register | R13 / SP |
| Destination register | R0 |
| Shift | None |

The path handles the Thumb-2 MOV T3 / ORR T2 family. Looking only for an implementation named “MOV” would miss the shared decoding logic. [Encoding analysis and affected path](https://github.com/renode/renode/issues/884).

## Where the rejection happened

The relevant condition in `arch/arm/translate.c` rejected register 13 as well as register 15:

```c
if(op0 == 0 && rm != 0xd && rm != 0xf) {
```

My patch removes the SP restriction while keeping the PC restriction:

```c
if(op0 == 0 && rm != 0xf) {
```

Here `rm` identifies the source register. The change lets SP pass through the existing operation; it does not introduce a new register-copy implementation. [Proposed decoder change](https://github.com/antmicro/tlib/pull/20/files).

The small size of the diff should not hide its scope: the decoder branch is shared. A review has to consider both MOV and ORR behavior, rather than judging the patch only by the one firmware instruction that motivated it.

## Compatibility needs a precise claim

My report distinguishes an `UNPREDICTABLE` encoding from one that is simply `UNDEFINED`, and argues for the behavior needed by the Cortex-M4 firmware under investigation.

That is not a promise that every ARM processor must execute this encoding the same way. It is also not advice to generate it in new portable firmware. A useful compatibility report should name the processor, the exact encoding, the binary that depends on it, and the behavior being proposed.

In this case, the SoftDevice was supplied as a precompiled binary. Rebuilding its dispatcher to choose another instruction was not an available fix for the simulation problem. [Firmware context](https://github.com/renode/renode/issues/884).

## Make the failure smaller than the application

I published two reproduction branches: [failing_case](https://github.com/ShahriarAhnaf/Renode/tree/failing_case) and [passing_case](https://github.com/ShahriarAhnaf/Renode/tree/passing_case).

Both point to a Robot Framework test at:

```text
tests/unit-tests/tlib/arm/thumb2-mov-sp-unpredictable.robot
```

The report records a distinct result for each path:

- The failing case leaves R0 at the fault-handler marker, `0xDEADDEAD`.
- The patched case leaves R0 at `0x20010000`, the expected stack-pointer value for the test.

These are the outcomes documented with the reproduction, not fresh measurements made for this article. The [issue includes the build and test commands](https://github.com/renode/renode/issues/884).

For a hobbyist, this is a manageable way into CPU emulation. Follow one instruction from its halfwords, through register-field extraction, to a decoder condition and an observable register value. You can understand that path without understanding the whole Bluetooth stack.

## What the experiment does and does not settle

A passing instruction test answers a narrow question: did this encoding produce the expected result in this model configuration?

It does not establish complete SoftDevice compatibility. It does not validate every instruction sharing the decoder branch. It does not settle how all implementations should handle every unpredictable encoding.

Those boundaries make the result more useful. Someone can reproduce the small claim, then extend the test matrix instead of treating one successful boot step as the end of the investigation.

## Work record

- Report and reproduction: [Renode issue #884](https://github.com/renode/renode/issues/884).
- Proposed implementation: [tlib PR #20](https://github.com/antmicro/tlib/pull/20).
- **September 6, 2026:** issue and PR remain open. Update this section when upstream review changes the approach or status; keep the article URL stable.

<!-- Author review: replace the broad “all silicon” wording from the original PR with a named hardware test matrix if you publish measured hardware claims. Add your actual board/firmware versions and traces when available. -->
