// src/components/Experience.js
import React, { useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const Experience = () => {
    const timelineRef = useRef(null);
    useScrollReveal(timelineRef, { selector: '.job' });

    return (
    <div className="experience" ref={timelineRef}>
        {/* ── Job 1 ─────────────────────────────────────────── */}
        <div className="job job-current">
            <div className="job-details">
                <h3>System Engineer III<span className="job-badge">Current</span></h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    February 2025 &ndash; Present
                    <span className="job-meta-sep">&bull;</span>
                    <em>Remote</em>
                </p>
                <p className="job-section-label">Core Competencies</p>

                <p className="job-competency">Independent Problem Solving &amp; Execution</p>
                <ul>
                    <li>Consistently solving complex problems and delivering solutions independently, often serving as a go-to resource for peers facing similar challenges.</li>
                    <li>Operating with a high degree of autonomy, requiring minimal direction on day-to-day work and proactively scoping new assignments.</li>
                </ul>

                <p className="job-competency">Documentation Excellence</p>
                <ul>
                    <li>Maintaining a strong track record of high-quality ticket documentation, upholding high team standards.</li>
                    <li>Authoring comprehensive documentation across multiple products and platforms, including operational SOPs, developer notes, and Atlassian knowledge base articles.</li>
                </ul>

                <p className="job-competency">Emerging Leadership</p>
                <ul>
                    <li>Regularly leading standups, team meetings, and cross-functional discussions.</li>
                    <li>Recognized as an emerging leader driving alignment, accountability, and team-wide operational readiness.</li>
                </ul>

                <p className="job-competency">Continuous Improvement &amp; Innovation</p>
                <ul>
                    <li>Championing continuous improvement initiatives, identifying and implementing process enhancements, tooling upgrades, and automation that increased team efficiency.</li>
                    <li>Taking calculated risks and experimenting with new approaches, with a proven history of turning experiments into adopted solutions.</li>
                </ul>

                <p className="job-competency">Multi-Technology Investigations</p>
                <ul>
                    <li>Investigating and resolving issues of moderate-to-high scope across multiple technologies&mdash;including application infrastructure, networking, databases, and security.</li>
                    <li>Often connecting dots across systems that others miss.</li>
                </ul>

                <p className="job-competency">Customer-First Mindset</p>
                <ul>
                    <li>Proactively identifying gaps and problems within area of ownership and driving them to resolution without waiting for escalation.</li>
                    <li>Leading complex, customer-impacting investigations end-to-end, coordinating across teams and delivering root cause analysis with actionable follow-ups.</li>
                </ul>

                <p className="job-competency">Operational Readiness &amp; Training</p>
                <ul>
                    <li>Independently driving operational readiness across the team, including maintaining up-to-date documentation, developing training materials, onboarding new team members, and writing SOPs to standardize processes.</li>
                </ul>

                <p className="job-competency">Subject Matter Expertise</p>
                <ul>
                    <li>Established SME in Incident Management Process and one or more System Operations products/services, regularly consulted by peers and leadership for guidance.</li>
                    <li>Deep experience coordinating and improving incident response workflows over multiple cycles.</li>
                </ul>
            </div>
        </div>

        {/* ── Job 2 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>System Engineer II</h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    July 2021 &ndash; February 2025
                    <span className="job-meta-sep">&bull;</span>
                    <em>Remote</em>
                </p>
                <ul>
                    <li>Developed Remediation Scripting For Troubleshooting Server Environment</li>
                    <li>Utilized CMDB (Configuration Management Database) with ServiceNow</li>
                    <li>Incident Management &amp; Alert Monitoring On 100K+ Server Network</li>
                    <li>Subject Matter Expert On WordPress Server Configuration &amp; Remediation</li>
                    <li>Monitored Network For DDoS Attacks Against Different Environments</li>
                    <li>Engaged with Kentik Software To Track Trends In Network Traffic</li>
                    <li>Mitigated Attacks Against Servers
                        <ul>
                            <li>Network Level Blocking</li>
                            <li>Network Swings</li>
                            <li>NetScout</li>
                            <li>iptables</li>
                        </ul>
                    </li>
                    <li>Identify Trending Incidents, Perform Root Cause Analysis &amp; Implement Process Changes To Reduce/Eliminate Recurrence</li>
                    <li>Apache &amp; IIS Troubleshooting</li>
                    <li>Setup/Configure Services In WHM/cPanel &amp; Plesk/Remote Desktop</li>
                    <li>MySQL/MSSQL Database Troubleshooting</li>
                    <li>Conducted Website &amp; Content Migrations</li>
                    <li>DNS &amp; Email Configuration Setup</li>
                    <li>Assisted Legal Team In Making Data Archives</li>
                    <li>Utilized Confluence &amp; Jira For Document Tracking &amp; Versioning</li>
                    <li>Completed Training To Keep Up With Best Security Principles &amp; Practices</li>
                </ul>
            </div>
        </div>

        {/* ── Job 3 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>System Engineer I</h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    November 2018 &ndash; July 2021
                    <span className="job-meta-sep">&bull;</span>
                    <em>Remote</em>
                </p>
                <ul>
                    <li>Incident Management &amp; Alert Monitoring On 100K+ Server Network</li>
                    <li>Identify Trending Incidents, Perform Root Cause Analysis &amp; Implement Process Changes To Reduce &amp; Eliminate Recurrence</li>
                    <li>Utilize Splunk Software &amp; Command-Line To Review Relayed Email</li>
                    <li>Coordinated With Tier 2 Agents To Assist In Providing First Contact Resolution</li>
                    <li>Apache &amp; IIS Troubleshooting</li>
                    <li>Managed &amp; Issued Network Violations For Users Abusing Network &amp; Hardware Services</li>
                    <li>Website &amp; Server Restorations</li>
                    <li>MySQL/MSSQL Database Troubleshooting</li>
                    <li>Assist Office of the CEO &amp; Management with Escalated Matters In The Environment</li>
                    <li>Website Security Review/Configuration/Analysis</li>
                    <li>Properly Identify and Remove Malware From Compromised Websites</li>
                    <li>Coordinated with Tier 2 Level Teams On How To Correct Issues with New Tools</li>
                    <li>Used Documented Issues To Have Developers Create Tools To Fix Common Issues</li>
                    <li>Created Technical Documentation for Tier 1 &amp; 2 For Best Practices When Configuring Services</li>
                    <li>Setup of A HelpBot (LiveEngage), Automated Bot That Provides Answers To Agents Based On Common Issues In The Environment</li>
                </ul>
            </div>
        </div>

        {/* ── Job 4 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>Hosting Technical Lead</h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    February 2016 &ndash; November 2018
                    <span className="job-meta-sep">&bull;</span>
                    <em>Scottsdale, Arizona | Remote</em>
                </p>
                <ul>
                    <li>Worked Server/Managed Services Incident Queue</li>
                    <li>Website Security Reviews/Configuration/Analysis</li>
                    <li>Utilized Splunk To Review Email Server Relays, As Well As Incoming And Outgoing Emails On The Network</li>
                    <li>Updated On External Facing Articles: <em><a href="https://godaddy.com/help" target="_blank" rel="noopener noreferrer"><b>GoDaddy Help Center</b></a></em></li>
                    <li>Beta Tested Cloud Servers: <em><a href="https://cloud.godaddy.com" target="_blank" rel="noopener noreferrer"><b>Cloud Platform Hosting</b></a></em></li>
                    <li>Reviewed Active Issues With Internal Agents</li>
                    <li>Created Internal Documentation In Relation To Troubleshooting Existing Support Issues</li>
                    <li>Tracked Trending Issues Affecting The Network Over Extended Periods</li>
                    <li>Completed Network Violation Reviews</li>
                    <li>Migrated WordPress Website Content (WordPress/Joomla/Personal Sites)</li>
                    <li>Completed Shared Hosting/Server Restores</li>
                </ul>
            </div>
        </div>

        {/* ── Job 5 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>Subject Matter Expert | Website Security</h3>
                <p className="job-meta">
                    <b>GoDaddy | Sucuri</b>
                    <span className="job-meta-sep">&bull;</span>
                    August 2015 &ndash; November 2018
                    <span className="job-meta-sep">&bull;</span>
                    <em>Scottsdale, Arizona</em>
                </p>
                <ul>
                    <li>Determined Cost-saving Strategies By Publicizing Internal &amp; New Documentation</li>
                    <li>Subject Matter Expert (Website Security | Sucuri)</li>
                    <li>Utilized Confluence/Jira For Document Tracking And Versioning</li>
                    <li>Implemented Proper Security Principles And Practices</li>
                    <li>Website Security Review/Configuration/Analysis</li>
                    <li>Properly Identify And Remove Malware From Compromised Websites</li>
                    <li>Implemented Fixes On Mis-configured Security Plans via API</li>
                    <li>Used Documented Issues To Have Developers Create Tools To Fix Common Issues</li>
                    <li>Coordinated With Tier 2 Level Teams On How To Correct Issues With New Tools</li>
                    <li>Created Technical Documentation For Tier 1 &amp; 2 For Best Practices When Configuring Services</li>
                </ul>
            </div>
        </div>

        {/* ── Job 6 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>Advanced Hosting IV</h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    November 2013 &ndash; January 2016
                    <span className="job-meta-sep">&bull;</span>
                    <em>Scottsdale, Arizona</em>
                </p>
                <ul>
                    <li>Tested cPanel And Plesk Releases For Shared Hosting Environment</li>
                    <li>Created Supporting Documentation/Help Articles For Customers/Agents</li>
                    <li>Provided Hosting Support For Front Of Site Chat Representatives</li>
                    <li>Reviewed And Corresponded To Network Violations In Relation To Customer Hosting Plans</li>
                    <li>Incident Management via Internal Ticketing System</li>
                </ul>
            </div>
        </div>

        {/* ── Job 7 ─────────────────────────────────────────── */}
        <div className="job">
            <div className="job-details">
                <h3>Hosting Online Support Team</h3>
                <p className="job-meta">
                    <b>GoDaddy</b>
                    <span className="job-meta-sep">&bull;</span>
                    February 2008 &ndash; October 2013
                    <span className="job-meta-sep">&bull;</span>
                    <em>Scottsdale, Arizona</em>
                </p>
                <ul>
                    <li>Instrumental In The Creation Of A Team Dedicated To Hosting Support</li>
                    <li>Piloted The Server Support Chat Team</li>
                    <li>Identified &amp; Helped Resolve Issues In Relation To Customer Shared &amp; Server Platforms</li>
                    <li>Reviewed Incidents From Customers via Email</li>
                    <li>Troubleshoot Email Configuration (MX Records/Mail Client Configuration)</li>
                    <li>Identified Trending Issues Within The Network</li>
                </ul>
            </div>
        </div>


    </div>
    );
};

export default Experience;
