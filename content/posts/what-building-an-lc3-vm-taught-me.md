---
title: "What building an LC-3 virtual machine taught me"
date: "2026-09-09"
description: "Printf debugging, learning what a program needs from a computer, and the beginnings of my journey toward Simantic."
draft: false
---

For my first post, I wanted to return to a small project: my [LC-3 virtual machine](https://github.com/ShahriarAhnaf/LC-3-VM).

It's a program written in C that interprets instructions for another computer architecture. It has memory, registers, a program counter, and code that decides what each instruction does. Small enough to follow, but with enough moving parts to make the ideas behind a computer feel concrete. I remember I didn't even take an OS class or anything to know any of this.

I started from [*Write your Own Virtual Machine* by Justin Meiners and Ryan Pendleton](https://www.jmeiners.com/lc3-vm/). They deserve the credit for the tutorial and its foundation. My repository records me stumbling through it, along with debugging output and experiments around instruction decoding and timing.

This was about the time where I was also realizing that just copying tutorials is not enough and that to truly understand a system you have to break and modify it. which was the goal here beyond the tutorial.

Looking back, this was the start of my journey toward building the emulator at [Simantic](https://simantic.dev). This little VM was how I started learning what a computer program actually needs in order to run.

## An instruction becomes a change in state

If you've taken first-year digital logic, think about an adder connected to a few registers. The adder calculates a result from its inputs. The registers hold on to bits, even after those inputs change. The bits currently stored in those registers are part of the computer's **state**.

An instruction tells the computer which values to use, what to do with them, and where to store the result. In a hardware implementation, control signals select the inputs and enable the right register to save the output. My VM describes those changes with C code. It models the result of executing an instruction, rather than simulating every gate or clock edge.

Take `ADD R2, R0, R1`. It means “add the numbers in R0 and R1, then put the answer in R2.” If R0 holds 3 and R1 holds 4, R2 becomes 7. Those input values are called **operands**. R2 is the **destination**: the register that receives the answer.

```text
R0 holds 3 ──┐
             ├── adder ── 7 gets saved in R2
R1 holds 4 ──┘
```

The LC-3 also remembers whether the most recent result was negative, zero, or positive. These are its **condition flags**: three stored yes/no bits, with one set to 1 to describe the result. For our answer of 7, the positive bit is set. Think of the zero flag as the output of a “does this equal zero?” circuit, saved so another instruction can use it later.

A **branch** is an instruction that can choose a different instruction to run next. A branch-on-zero checks that saved zero bit. If it is 1, execution jumps to the specified location; otherwise, it carries on. In digital logic terms, that decision is like a select signal choosing between two inputs of a multiplexer: the next address in order, or the branch's target address.

This is why getting the addition right is only part of the job. If the answer changes from 7 to 0 but I forget to update those saved bits, a later branch makes its decision using the old result.

The core of the VM is a loop: read an instruction, work out what it means, update the stored values, and repeat. I was already very familiar with loops, so how hard could it be...

In my implementation, reading an instruction and finding the operation looks like this:

```c
uint16_t instr = mem_read(registers[R_PC]++);
uint16_t op = instr >> 12;
```

The **program counter**, `R_PC`, is a register holding the memory address of the next instruction. The first line reads the instruction at that address and advances the counter by one. Each LC-3 instruction is 16 bits long. The second line shifts it right by 12 bits, leaving the top four bits. Those bits are the **opcode**: the code that selects an operation such as addition.

Think of those four bits as inputs to a decoder in a digital logic lab. They tell the machine which operation to perform. Other bits in the instruction select registers or supply a small number directly. My C code uses a `switch` to choose what happens next; the individual cases live in [main.c](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/main.c).

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

A useful way to learn from this project is to trace one instruction by hand. Choose starting register values, predict the answer and which negative/zero/positive bit should be set, then compare those predictions with the implementation. Extend that to a branch and follow the next instruction address.

You don't need a large program to find a mistake in a state transition. A tiny example is often easier to reason about because you can account for every change.

## A memory read can have behavior

The keyboard handling is another part worth following.

In `mem_read`, the keyboard-status address receives special treatment. The VM checks whether terminal input is available. If it is, it updates the emulated keyboard status and data locations before returning the requested value. [Memory-read implementation](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/src/VM.c).

So an instruction that looks like a memory access can interact with a device model. That is a useful connection between the CPU loop and the world outside it: the program sees an address, while the implementation gives that address behavior.

## Optimization made me ask better questions

I also experimented with reading the bits that select registers before the `switch` chooses an operation. Several instructions use the same bit positions for these register numbers, so I wanted to see whether I could do that work once in a shared part of the loop. The repository includes a logging build and a [Python script comparing timings by opcode](https://github.com/ShahriarAhnaf/LC-3-VM/blob/e5a7f36448a45e1cfcb3a2d863018b3252ca31b6/optimized-compare.py).

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
