import { ArrowDown, ArrowRight, ArrowUpRight, CodeXml, FileText, BookOpen, Cpu, Terminal } from 'lucide-react';
import { Experience } from './experience';

const github = 'https://github.com/ShahriarAhnaf';
const resume = `${github}/resume/blob/master/Ahnaf_Shahriar_Resume.pdf`;

function CpuPipeline() {
  const stages = [{ name: 'IF', label: 'Fetch' }, { name: 'ID', label: 'Decode' }, { name: 'EX', label: 'Execute' }, { name: 'MEM', label: 'Memory' }, { name: 'WB', label: 'Write back' }];
  return <div className="cpu-diagram" role="img" aria-label="Five-stage CPU pipeline: instruction fetch, decode, execute, memory, and write back, with a forwarding path.">
    <div className="diagram-heading"><span><Cpu size={16} /> CeePeeU architecture</span><span>5-stage pipeline</span></div>
    <div className="pipeline">{stages.map((stage, i) => <div className="pipeline-unit" key={stage.name}><div className={`pipeline-stage stage-${i}`}>{stage.name}</div><span>{stage.label}</span>{i < 4 && <ArrowRight className="pipeline-arrow" size={14} />}</div>)}</div>
    <div className="forwarding-path"><span>Data forwarding</span></div>
    <div className="diagram-bottom"><span><span className="diagram-dot" /> PYNQ FPGA</span><span>Verilog / RISC-V</span></div>
  </div>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="Ahnaf, home">Ahnaf<span>.</span></a>
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a></nav>
      <a className="contact-link" href="mailto:founders@simantic.dev">Let's talk <ArrowUpRight size={17} /></a>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="intro-line"><span className="status-dot" /> Ahnaf Shahriar <span className="intro-role">Founder & engineer</span></div>
          <h1 id="hero-title">Close to<br />the metal.</h1>
          <p className="hero-description">I’m Ahnaf, cofounder & CTO at <a href="https://simantic.dev" target="_blank" rel="noreferrer">Simantic</a>.<br />I build the tools that let AI understand the physical world.</p>
          <div className="hero-actions"><a className="button-primary" href="#work">Explore my work <ArrowDown size={17} /></a><a className="github-link" href={github} target="_blank" rel="noreferrer"><CodeXml size={18} /> GitHub <ArrowUpRight size={15} /></a></div>
        </div>
        <div className="hero-art"><img src="/images/silicon-hero.jpg" alt="Exploded silver microprocessor assembly with a cobalt silicon core" width="1536" height="1024" fetchPriority="high" /><span className="art-caption"><span /> Software starts somewhere.</span></div>
        <div className="hero-bottom"><span>Embedded systems. Unbounded ambition.</span><a className="yc-badge" href="https://www.ycombinator.com/companies/simantic" target="_blank" rel="noreferrer"><span>Y</span> Y Combinator <b>F26</b><ArrowUpRight size={14} /></a><a className="scroll-link" href="#work">Scroll to explore <ArrowDown size={15} /></a></div>
      </section>

      <div className="company-strip"><span>Built with teams at</span><div><span className="brand-logo brand-neuralink"><img src="/images/companies/neuralink.png" alt="Neuralink" width="36" height="36" /></span><span className="brand-logo brand-tesla"><img src="/images/companies/tesla.svg" alt="Tesla" width="36" height="36" /></span><span className="brand-logo brand-onsemi"><img src="/images/companies/onsemi.svg" alt="onsemi" width="115" height="21" /></span><span className="brand-logo brand-nxp"><img src="/images/companies/nxp.svg" alt="NXP" width="83" height="28" /></span><span className="brand-logo brand-ford"><img src="/images/companies/ford.svg" alt="Ford" width="90" height="90" /></span></div></div>

      <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
        <div className="section-heading"><h2 id="work-title">Ideas, made real.</h2><span>A selection of things I’ve built</span></div>
        <a className="simantic-feature" href="https://simantic.dev" target="_blank" rel="noreferrer">
          <div><span className="current-label"><span className="status-dot" /> What I’m building now</span><h3>Simantic<ArrowUpRight /></h3><p>Firmware simulation for AI agents.<br />Build and test before the hardware exists.</p><span className="feature-footer">Cofounder & CTO <span>YC Fall 2026</span></span></div>
          <div className="simantic-right"><div className="simulation-flow" aria-label="Firmware goes into virtual hardware and produces observable results"><span>Firmware</span><ArrowRight size={14} /><span>Virtual hardware</span><ArrowRight size={14} /><span>Observe</span></div><div className="simantic-statement">The physical world.<br />Now programmable.</div><span className="simantic-visit">Meet Simantic <ArrowUpRight size={17} /></span></div>
        </a>
        <div className="featured-projects">
          <a href={`${github}/CubeSolver`} target="_blank" rel="noreferrer" className="project-card">
            <div className="project-visual cube-visual"><img src="/images/cube-demo.png" alt="CubeSolver running in OpenGL, showing a colorful Rubik’s cube and rotation controls" width="1598" height="1052" loading="lazy" /><span className="visual-label">The real thing, running in OpenGL</span></div>
            <div className="project-info"><div className="project-title"><h3>Cube Solver</h3><ArrowUpRight size={23} /></div><p>A Rubik’s cube, solved from the bits up. A C++ solver with interactive scrambling and animated OpenGL visualization.</p><div className="project-tags"><span>C++</span><span>OpenGL</span><span>Algorithms</span></div></div>
          </a>
          <a href={`${github}/CeePeeU`} target="_blank" rel="noreferrer" className="project-card">
            <div className="project-visual cpu-visual"><CpuPipeline /></div>
            <div className="project-info"><div className="project-title"><h3>CeePeeU</h3><ArrowUpRight size={23} /></div><p>A processor, built from scratch. A five-stage pipelined CPU in Verilog, brought to life on a PYNQ FPGA.</p><div className="project-tags"><span>Verilog</span><span>Computer architecture</span><span>FPGA</span></div></div>
          </a>
        </div>
        <div className="more-projects">
          <a href={`${github}/Vhdl-compiler`} target="_blank" rel="noreferrer"><span className="small-project-icon"><CodeXml size={25} /></span><div><h3>VHDL Compiler</h3><p>From circuit descriptions to synthesized logic and waveforms.</p><span>Java / Compilers</span></div><ArrowUpRight size={21} /></a>
          <a href={`${github}/LC-3-VM`} target="_blank" rel="noreferrer"><span className="small-project-icon"><Terminal size={24} /></span><div><h3>LC-3 Virtual Machine</h3><p>A computer inside a computer. An emulator with debugging and opcode profiling.</p><span>C / Emulation</span></div><ArrowUpRight size={21} /></a>
        </div>
        <div className="work-bottom"><span>There’s more where that came from.</span><a href={`${github}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={16} /></a></div>
      </section>

      <section className="experience-section" id="experience" aria-labelledby="experience-title"><div className="section-wrap experience-layout"><div className="experience-intro"><span className="section-kicker">Experience & internships</span><h2 id="experience-title">Learn by<br />building.</h2><p>From wireless chips to neural interfaces. Different systems, the same curiosity about what makes them work.</p><a className="text-link" href={resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={16} /></a><span className="resume-date">Archive · May 2025</span></div><Experience /></div></section>

      <section className="about-section section-wrap" id="about" aria-labelledby="about-title"><div className="about-heading"><span className="section-kicker">A little about me</span><h2 id="about-title">Serious about systems.<br />Always curious.</h2><div className="about-photo"><img src="/images/ahnaf.jpg" alt="Ahnaf working on a laptop beside the water" width="200" height="200" loading="lazy" /><div><span>Ahnaf Shahriar</span><span>Occasionally touching grass.</span></div></div></div><div className="about-copy"><p>I like understanding things all the way down. How a program becomes an instruction. How an instruction moves through silicon. What happens when the real world doesn’t behave like the spec.</p><p>That curiosity took me through Computer Engineering at Waterloo, embedded software, and AI hardware. Now I’m building <a href="https://simantic.dev" target="_blank" rel="noreferrer">Simantic</a> with Seungmin Hong, making it possible to develop firmware without waiting for physical hardware.</p><p className="about-aside">My GitHub bio says “Fake Computer Engineer.”<br />The projects are real.</p><div className="about-socials"><a href="https://x.com/enough_ahnaf" target="_blank" rel="noreferrer">X / Twitter <ArrowUpRight size={15} /></a><a href="https://www.linkedin.com/in/ahnaf-s" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} /></a><a href={github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a></div></div></section>

      <section className="resources-section section-wrap" aria-labelledby="resources-title"><div className="section-heading"><h2 id="resources-title">The useful links.</h2><span>Less digging. More building.</span></div><div className="resource-grid"><a href={resume} target="_blank" rel="noreferrer"><FileText size={23} /><div><h3>Résumé</h3><p>PDF archive · May 2025</p></div><ArrowUpRight size={20} /></a><a href="https://simantic.dev/docs" target="_blank" rel="noreferrer"><BookOpen size={23} /><div><h3>Simantic docs</h3><p>Get a simulation running</p></div><ArrowUpRight size={20} /></a><a href="https://www.ycombinator.com/companies/simantic" target="_blank" rel="noreferrer"><span className="resource-y">Y</span><div><h3>YC founder profile</h3><p>Simantic · Fall 2026</p></div><ArrowUpRight size={20} /></a></div></section>

      <footer className="site-footer"><div className="footer-top"><span>Good things start with a conversation.</span><a href="mailto:founders@simantic.dev">Let’s build<br />something real.<ArrowUpRight /></a><div className="footer-links"><a href="mailto:founders@simantic.dev">founders@simantic.dev <ArrowUpRight size={16} /></a><a href="https://x.com/enough_ahnaf" target="_blank" rel="noreferrer">Find me on X <ArrowUpRight size={16} /></a></div></div><div className="footer-bottom"><a className="wordmark" href="#">Ahnaf<span>.</span></a><span>Always a work in progress.</span><a href="#">Back to top <ArrowUpRight size={15} /></a></div></footer>
    </main>
  </>;
}
