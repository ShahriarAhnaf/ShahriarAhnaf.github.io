---
title: "What building an LC-3 virtual machine taught me"
date: "2026-09-09"
description: "A small C project that made instructions, memory, debugging, and performance measurement concrete for me."
draft: false
---

For my first post, I wanted to return to a small project: my [LC-3 virtual machine](https://github.com/ShahriarAhnaf/LC-3-VM).

It's a program written in C that interprets instructions for another computer architecture. It has memory, registers, a program counter, and code that decides what each instruction does. Small enough to follow, but with enough moving parts to make the ideas behind a computer feel concrete.

I started from [*Write your Own Virtual Machine* by Justin Meiners and Ryan Pendleton](https://www.jmeiners.com/lc3-vm/). They deserve the credit for the tutorial and its foundation. My repository records my work through it, along with debugging output and experiments around instruction decoding and timing.

This post is about what I take away from that work, including things I would approach differently now.

## An instruction becomes a change in state

The core of the VM is a loop. Read an instruction, work out what it means, update the machine, and repeat.

In my implementation, fetching an instruction and finding its opcode looks like this:

```c
uint16_t instr = mem_read(registers[R_PC]++);
uint16_t op = instr >> 12;
```

The program counter says where to read. The upper four bits select the operation. The rest of the instruction supplies fields such as register numbers or an immediate value—a number carried inside the instruction itself. The execution cases live in [main.c](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/main.c).

That makes assembly less abstract. An `ADD` needs code that finds its operands, performs the addition, writes the destination, and updates the condition flags. A branch needs code that checks those flags and changes the program counter.

The flags connect one instruction to the next. If a calculation produces zero, that fact has to survive long enough for a later branch to use it. Forgetting that update changes the program even if the arithmetic itself is correct.

## A register number is not the value inside it

One distinction worth getting straight is the difference between selecting a register and reading its contents.

```text
instruction bits → register index → stored value
```

The index `1` selects R1. The value in R1 could be a number, an address, or a bit pattern whose meaning depends on the instruction using it.

My old README muddles this by saying registers only contain addresses. They don't. Looking back at the project is useful partly because I can correct explanations like that instead of preserving them as if they were finished knowledge.

The same care matters with memory. The array in [VM.h](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/VM.h) has 65,536 entries, each holding a 16-bit word. An address chooses an entry; the entry contains a value. A load-indirect instruction follows an extra step: it reads an address from memory, then reads the value at that address.

Those distinctions are small enough to explain in a sentence and important enough to break an entire program.

## Debugging needs a view into the machine

I added functions to dump memory and register state. `MAP_VM` records nonzero memory contents, while `MAP_REGISTERS` records register snapshots. In the debug build, the main loop requests a snapshot when it encounters a branch opcode. [Debugging helpers](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/VM.c).

That gives me something more useful than a final answer that is simply wrong. I can ask where execution went, what the registers held, and what condition the branch observed.

A useful way to learn from this project is to trace one instruction by hand. Choose starting register values, predict the result and flags, then compare those predictions with the implementation. Extend that to a branch and follow the next instruction address.

You don't need a large program to find a mistake in a state transition. A tiny example is often easier to reason about because you can account for every change.

## A memory read can have behavior

The keyboard handling is another part worth following.

In `mem_read`, the keyboard-status address receives special treatment. The VM checks whether terminal input is available. If it is, it updates the emulated keyboard status and data locations before returning the requested value. [Memory-read implementation](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/VM.c).

So an instruction that looks like a memory access can interact with a device model. That is a useful connection between the CPU loop and the world outside it: the program sees an address, while the implementation gives that address behavior.

## Optimization made me ask better questions

I also experimented with extracting shared register fields before the opcode switch. The repository includes a logging build and a [Python script comparing timings by opcode](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/optimized-compare.py).

The interesting question was whether repeated decoding work could be moved into a common path. But a common path still has to supply the right fields for every instruction that uses them. Fewer repeated lines are not enough to establish correctness or speed.

Looking at the measurement code now, I would also be more careful with the evidence. The logger subtracts only the nanosecond fields of two timestamps, which mishandles measurements that cross a second boundary. The comparison script applies a scaling factor that needs checking before its displayed units can be trusted. Per-instruction timing also needs to account for the cost of measurement itself.

I wouldn't use the old output as a reliable speedup claim today. I would first verify the instruction behavior, then compare repeatable workloads with clear timing units and an explicit baseline.

That is part of what makes keeping this project useful. The code preserves both the experiment and the assumptions I can revisit.

## Why start here?

A small VM gives me a place to follow a program all the way through: instruction bits, register values, memory accesses, and the next address to execute.

It also captures the kind of learning I want this site to document. Start with something understandable, build on it, make the internal behavior visible, and come back with better questions.

The [source is here](https://github.com/ShahriarAhnaf/LC-3-VM). If you want to build your own, the [original tutorial](https://www.jmeiners.com/lc3-vm/) is the starting point I used. My repository preserves the implementation, experiments, and unfinished edges.
