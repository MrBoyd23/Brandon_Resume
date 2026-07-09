import React, { useState } from 'react';
import styles from '../../css/SkillPage.module.css';
import useDocTitle from '../../hooks/useDocTitle';
import CodeBlock from './CodeBlock';

const appPoolCode = `# IIS Application Pool troubleshooting
# Common diagnostic commands used during incident response

# List all application pools and their state
%windir%\\system32\\inetsrv\\appcmd list apppool

# Check application pool state for a specific site
%windir%\\system32\\inetsrv\\appcmd list apppool "DefaultAppPool" /text:state

# Recycle an application pool (common first-response action)
%windir%\\system32\\inetsrv\\appcmd recycle apppool "DefaultAppPool"

# Start a stopped application pool
%windir%\\system32\\inetsrv\\appcmd start apppool "CustomerSite"

# Check worker process memory usage
%windir%\\system32\\inetsrv\\appcmd list wp

# View application pool configuration
%windir%\\system32\\inetsrv\\appcmd list apppool "DefaultAppPool" /config

# Set rapid-fail protection threshold
%windir%\\system32\\inetsrv\\appcmd set apppool "DefaultAppPool" \\
  /failure.rapidFailProtection:true \\
  /failure.rapidFailProtectionInterval:00:05:00 \\
  /failure.rapidFailProtectionMaxCrashes:5`;

const bindingsCode = `# IIS site bindings and SSL configuration
# Managing multi-site hosting on Windows servers

# List all sites and their bindings
%windir%\\system32\\inetsrv\\appcmd list site

# Add HTTPS binding to an existing site
%windir%\\system32\\inetsrv\\appcmd set site /site.name:"CustomerSite" \\
  /+bindings.[protocol='https',bindingInformation='*:443:customer.com']

# Import and bind an SSL certificate
# Step 1: Import cert to Windows certificate store
certutil -importpfx customer.pfx

# Step 2: Bind cert to site using netsh
netsh http add sslcert \\
  ipport=0.0.0.0:443 \\
  certhash=<certificate-thumbprint> \\
  appid='{<application-id>}' \\
  certstorename=MY

# Check existing SSL bindings
netsh http show sslcert

# Redirect HTTP to HTTPS via web.config
# <system.webServer>
#   <rewrite>
#     <rules>
#       <rule name="HTTP to HTTPS" stopProcessing="true">
#         <match url="(.*)" />
#         <conditions>
#           <add input="{HTTPS}" pattern="off" />
#         </conditions>
#         <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" />
#       </rule>
#     </rules>
#   </rewrite>
# </system.webServer>`;

const troubleshootCode = `# IIS troubleshooting workflow — 500 Internal Server Error
# Systematic approach used during customer-impacting incidents

# Step 1: Check IIS logs for the specific error
# Logs location: C:\\inetpub\\logs\\LogFiles\\W3SVC<site-id>\\
# Look for sc-status 500 and sc-substatus code

Get-Content "C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex*.log" -Tail 100 |
  Select-String "500"

# Step 2: Enable Failed Request Tracing (FREB)
# Captures detailed request pipeline for 500 errors
%windir%\\system32\\inetsrv\\appcmd configure trace "CustomerSite" \\
  /enable /path:*.aspx /statuscodes:500

# Step 3: Check Event Viewer for application errors
Get-EventLog -LogName Application -Source "ASP.NET*" -Newest 20 |
  Format-Table TimeGenerated, EntryType, Message -AutoSize

# Step 4: Verify permissions on content directory
icacls "C:\\inetpub\\wwwroot\\CustomerSite" /verify

# Step 5: Check .NET Framework / ASP.NET registration
%windir%\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_regiis.exe -lv

# Step 6: Validate web.config syntax
%windir%\\system32\\inetsrv\\appcmd verify config "CustomerSite"

# Common fixes:
# - App pool running wrong .NET version
# - Permissions on web.config or content folder
# - Corrupted machine.config
# - Missing handler mappings after framework update`;

const IIS = () => {
  useDocTitle('IIS');
  const [activeTab, setActiveTab] = useState('apppool');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>IIS</h1>
        <p className={styles.heroTagline}>Windows web server troubleshooting across a 100,000+ server fleet</p>
        <div className={styles.heroBadges}>
          {['App Pools', 'SSL Bindings', 'FREB Tracing', 'appcmd', 'ASP.NET', 'Incident Response'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It</h2>
          <p className={styles.sectionText}>
            IIS troubleshooting has been part of my work across three roles at GoDaddy — System Engineer I, II,
            and III. On a hosting platform supporting 100,000+ servers, IIS issues are a daily occurrence: crashed
            application pools, SSL binding mismatches, permission errors, and ASP.NET misconfigurations.
          </p>
          <p className={styles.sectionText}>
            I use <code>appcmd</code> and PowerShell to diagnose and resolve issues remotely. Failed Request
            Tracing (FREB) is my go-to for 500 errors that don't surface in standard logs. For recurring patterns,
            I document the diagnostic steps and create runbooks for the team.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>3</div>
              <div className={styles.statLabel}>Roles Using IIS</div>
            </div>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>100K+</div>
              <div className={styles.statLabel}>Server Fleet</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Troubleshooting Approach</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Application pool diagnostics</strong> — Most IIS issues start with
            the app pool. Check state, recycle if needed, verify .NET version, and review rapid-fail protection
            settings before digging deeper.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>SSL and bindings</strong> — Certificate expiration, binding
            conflicts, and HTTP-to-HTTPS redirect loops are common escalation points. <code>netsh</code> and
            <code>certutil</code> are the diagnostic tools.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: 'var(--accent-soft)' }}>Failed Request Tracing</strong> — When logs don't tell the story,
            FREB captures the full request pipeline. Especially useful for authentication failures and module-level
            errors that produce generic 500 responses.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Before recycling an app pool during an incident, check <code>appcmd list wp</code>
            to see worker process memory. If it's climbing, the recycle fixes the symptom but you need to find
            the memory leak source in the application.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Diagnostics</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['apppool', 'App pools'], ['bindings', 'SSL & bindings'], ['troubleshoot', '500 error workflow']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#3b82f6' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <CodeBlock filename={activeTab === 'apppool' ? 'appcmd' : activeTab === 'bindings' ? 'bindings' : 'troubleshooting'} language="powershell" code={activeTab === 'apppool' ? appPoolCode : activeTab === 'bindings' ? bindingsCode : troubleshootCode} showLineNumbers />
      </div>
    </div>
  );
};

export default IIS;
