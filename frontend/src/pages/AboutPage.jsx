import { Building2, Smartphone, Wallet, ArrowLeftRight, BookOpen, Headset, ShieldCheck, Phone, Mail, Clock, Download, CheckCircle2 } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useThemeLang } from '../context/ThemeLangContext';

export function AboutPage() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const { t } = useThemeLang();

  return (
    <>
      <section className="about-hero">
        <h1>{t('about_h1')}</h1>
        <p>{t('about_intro')}</p>

        <div className="about-stats">
          <div className="stat-pill">
            <div className="n">23</div>
            <div className="l">{t('about_stat_regions')}</div>
          </div>
          <div className="stat-pill">
            <div className="n">100+</div>
            <div className="l">{t('about_stat_agences_tchad')}</div>
          </div>
          <div className="stat-pill">
            <div className="n">40</div>
            <div className="l">{t('about_stat_agences_ndj')}</div>
          </div>
        </div>
      </section>

      <section className="about-block">
        <h2><Building2 size={18} /> {t('about_who_title')}</h2>
        <p>{t('about_who_p1')}</p>
        <p>{t('about_who_p2')}</p>
      </section>

      <section className="about-block">
        <h2><Smartphone size={18} /> {t('about_app_title')}</h2>
        <p>{t('about_app_p1')}</p>

        <div className="about-features">
          <div className="about-feature">
            <div className="icon"><ArrowLeftRight size={16} /></div>
            <div>
              <strong>{t('about_feat_1_title')}</strong>
              <span>{t('about_feat_1_desc')}</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Wallet size={16} /></div>
            <div>
              <strong>{t('about_feat_2_title')}</strong>
              <span>{t('about_feat_2_desc')}</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Building2 size={16} /></div>
            <div>
              <strong>{t('about_feat_3_title')}</strong>
              <span>{t('about_feat_3_desc')}</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><ArrowLeftRight size={16} /></div>
            <div>
              <strong>{t('about_feat_4_title')}</strong>
              <span>{t('about_feat_4_desc')}</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><BookOpen size={16} /></div>
            <div>
              <strong>{t('about_feat_5_title')}</strong>
              <span>{t('about_feat_5_desc')}</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Headset size={16} /></div>
            <div>
              <strong>{t('about_feat_6_title')}</strong>
              <span>{t('about_feat_6_desc')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="about-install">
          <div className="about-install-icon"><Smartphone size={22} /></div>
          <div className="about-install-text">
            <strong>{t('about_install_title')}</strong>
            <span>
              {installed ? t('about_install_installed') : canInstall ? t('about_install_available') : t('about_install_manual')}
            </span>
          </div>
          {installed ? (
            <span className="about-install-done"><CheckCircle2 size={16} /> {t('about_install_done')}</span>
          ) : canInstall ? (
            <button className="about-install-btn" onClick={promptInstall}>
              <Download size={14} /> {t('about_install_btn')}
            </button>
          ) : null}
        </div>
      </section>

      <section className="about-block">
        <h2><ShieldCheck size={18} /> {t('about_commit_title')}</h2>
        <p>
          {t('about_commit_p_before')}
          <a href="/calculatrice" style={{ color: 'var(--orange)', fontWeight: 700 }}>{t('about_commit_link')}</a>
          {t('about_commit_p_after')}
        </p>
      </section>

      <section className="about-block">
        <h2><Headset size={18} /> {t('about_contact_title')}</h2>
        <p>{t('about_contact_address')}</p>
        <div className="about-contact">
          <a href="tel:+23597787878"><Phone size={13} /> +235 97 78 78 78</a>
          <a href="mailto:contact@tchad.nitatransfert.com"><Mail size={13} /> contact@tchad.nitatransfert.com</a>
          <span className="about-contact-hours" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--t2)', padding: '8px 4px' }}>
            <Clock size={13} /> {t('about_contact_hours')}
          </span>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
