'use client';

import { ArrowUpRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const experience = [
  { company: 'Neuralink', role: 'Embedded Software Engineer', detail: 'Implant & Charger', logo: 'neuralink.png', style: 'neuralink', description: 'Embedded software for the Implant and Charger teams. Working where software meets the physical constraints of a brain–computer interface.', source: 'https://www.ycombinator.com/companies/simantic', sourceLabel: 'Founder profile' },
  { company: 'Tesla', role: 'AI Hardware Engineer', detail: 'Dojo & Autopilot', logo: 'tesla.svg', style: 'tesla', description: 'AI hardware engineering across Dojo and Autopilot. Systems built at the intersection of computation, silicon, and the real world.', source: 'https://www.ycombinator.com/companies/simantic', sourceLabel: 'Founder profile' },
  { company: 'onsemi', role: 'Wireless Firmware Developer', detail: 'Jan – Apr 2025', logo: 'onsemi.svg', style: 'onsemi', description: 'Built I3C and Bluetooth SDK samples, worked on LE Audio and Bluetooth profiles, improved a wireless state machine, and automated SDK testing.', source: 'https://github.com/ShahriarAhnaf/resume/blob/master/Ahnaf_Shahriar_Resume.pdf', sourceLabel: 'Résumé · May 2025' },
  { company: 'NXP', role: 'IC Design & Verification Intern', detail: '2023 & 2024', logo: 'nxp.svg', style: 'nxp', description: 'Two internships spanning ECC and IP design, timing analysis, and SystemVerilog functional tests for high-speed dataplane chips.', source: 'https://github.com/ShahriarAhnaf/resume/blob/master/Ahnaf_Shahriar_Resume.pdf', sourceLabel: 'Résumé · May 2025' },
  { company: 'Synapse', role: 'Embedded Software Engineering Intern', detail: 'Sep – Dec 2022', logo: 'synapse.svg', style: 'synapse', description: 'Prototyped with Zephyr and nRF52, wrote I²C and UART drivers, and built APIs for lab equipment at Synapse Product Development.', source: 'https://github.com/ShahriarAhnaf/resume/blob/master/Ahnaf_Shahriar_Resume.pdf', sourceLabel: 'Résumé · May 2025' },
  { company: 'Ford', role: 'Firmware Developer', detail: 'Jan – Apr 2022', logo: 'ford.svg', style: 'ford', description: 'Optimized unit tests, automated workflows with Jenkins, and parsed CAN and serial traces for firmware development.', source: 'https://github.com/ShahriarAhnaf/resume/blob/master/Ahnaf_Shahriar_Resume.pdf', sourceLabel: 'Résumé · May 2025' },
];

export function Experience() {
  return <Accordion className="experience-list">
    {experience.map((job) => <AccordionItem key={job.company} value={job.company} className="experience-item">
      <AccordionTrigger className="experience-trigger">
        <span className={`company-mark ${job.style}`} aria-hidden="true"><img src={`/images/companies/${job.logo}`} alt="" width="64" height="36" loading="lazy" /></span>
        <span className="job-title"><span>{job.company}</span><span>{job.role}</span></span>
        <span className="job-detail">{job.detail}</span>
      </AccordionTrigger>
      <AccordionContent className="job-description"><p>{job.description}</p><a href={job.source} target="_blank" rel="noreferrer">{job.sourceLabel} <ArrowUpRight size={14} /></a></AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}
