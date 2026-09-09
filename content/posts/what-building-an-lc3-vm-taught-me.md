---
title: "What building an LC-3 virtual machine taught me"
date: "2026-09-09"
description: "Printf debugging, learning what a program needs from a computer, and the beginnings of my journey toward Simantic."
draft: false
---

For my first post, I wanted to return to a small project: my [LC-3 virtual machine](https://github.com/ShahriarAhnaf/LC-3-VM).

It's a program written in C that interprets instructions for another computer architecture. It has memory, registers, a program counter, and code that decides what each instruction does. Small enough to follow, but with enough moving parts to make the ideas behind a computer feel concrete.

I started from [*Write your Own Virtual Machine* by Justin Meiners and Ryan Pendleton](https://www.jmeiners.com/lc3-vm/). They deserve the credit for the tutorial and its foundation. My repository records my work through it, along with debugging output and experiments around instruction decoding and timing.

Looking back, this was the start of my journey toward building the emulator at [Simantic](https://simantic.dev). This little VM was how I started learning what a computer program actually needs in order to run.

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

## Printf debugging (trace debugging for the pros)

Funnily enough, I barely used GDB or LLDB back then. I worked through this project with `printf` debugging—trace debugging for the pros.

Print the state. Run the program. Read what happened. Try to work out where it stopped matching what I expected.

I added functions to dump memory and register state. `MAP_VM` records nonzero memory contents, while `MAP_REGISTERS` records register snapshots. In the debug build, the main loop requests a snapshot when it encounters a branch opcode. [Debugging helpers](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/VM.c).

Those dumps were my view into the machine. I could follow where execution went, what the registers held, and what condition a branch observed. A wrong final answer became a sequence of changes I could inspect.

The useful habit was making the program explain what it was doing. I had to decide which state mattered enough to print, then connect that output back to the instruction that changed it. That is a habit I still want in an emulator: being able to see why the firmware reached a particular state.

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

## From LC-3 to Simantic

The question this project opened up for me was: what does a program actually need from a computer?

For this VM, the answer started with somewhere to keep state, rules for executing instructions, and ways to get input and produce output. The keyboard example made that last part tangible. Implementing arithmetic was only part of the job; the program also expected certain addresses to behave like a device.

That is the connection I see to [Simantic](https://simantic.dev) now. The systems are more complicated, but I am still working on giving firmware the machine behavior it expects—and making that behavior visible enough to understand when something goes wrong.

An instruction has to update the right state. A peripheral access has to mean something. An event the program is waiting for has to arrive under the right conditions. My LC-3 project gave me a small enough version of that problem to start working through it myself.

I don't want to rewrite the story as if I had Simantic planned from the beginning. Looking back, I can see the thread: a small interpreter, a lot of printed state, and the realization that I could build the environment a program needs to run.

That is why I wanted this to be my first post. It gives this site a starting point I can keep coming back to as the work grows.

The [source is here](https://github.com/ShahriarAhnaf/LC-3-VM). If you want to build your own, the [original tutorial](https://www.jmeiners.com/lc3-vm/) is the starting point I used. My repository preserves the implementation, experiments, and unfinished edges.
