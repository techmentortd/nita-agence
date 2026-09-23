import { useMemo, useState } from 'react';
import { Calculator, ArrowRight, Info, Globe2 } from 'lucide-react';
import { calculerFrais, fmtFcfa, fmtTaux, TIERS, PAYS_INTERNATIONAL } from '../utils/frais';
import { useThemeLang } from '../context/ThemeLangContext';
import { countryLabel } from '../i18n/translations';

const PRESETS = [5000, 25000, 100000, 250000, 500000, 1000000];

export function CalculatorPage() {
  const { t, lang } = useThemeLang();
  const [zone, setZone] = useState('national'); // 'national' | 'international'
  const [pays, setPays] = useState(PAYS_INTERNATIONAL[0]);
  const [raw, setRaw] = useState('100000');

  const montant = Number(raw.replace(/[^\d]/g, ''));
  const result = useMemo(() => calculerFrais(montant), [montant]);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setRaw(digits);
  };

  const displayValue = montant ? montant.toLocaleString('fr-FR') : '';
  const paysLabel = countryLabel(pays, lang);
  const intlNote = t('calc_intl_note').split('%PAYS%').join(paysLabel);

  return (
    <section className="section" style={{ maxWidth: 720 }}>
      <div className="calc-head">
        <div className="calc-icon">
          <Calculator size={20} />
        </div>
        <div className="calc-head-text">
          <h1>{t('calc_title')}</h1>
          <p>{t('calc_sub')}</p>
        </div>
      </div>

      <div className="calc-zone-tabs">
        <button className={zone === 'national' ? 'active' : ''} onClick={() => setZone('national')}>
          {t('calc_tab_national')}
        </button>
        <button className={zone === 'international' ? 'active' : ''} onClick={() => setZone('international')}>
          <Globe2 size={13} /> {t('calc_tab_intl')}
        </button>
      </div>

      <div className="calc-card">
        {zone === 'international' && (
          <>
            <label className="calc-label" htmlFor="pays">{t('calc_label_country')}</label>
            <div className="login-field" style={{ marginBottom: 16 }}>
              <select id="pays" value={pays} onChange={(e) => setPays(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 14, color: 'var(--t1)', fontFamily: 'inherit' }}>
                {PAYS_INTERNATIONAL.map((p) => (
                  <option key={p} value={p}>{countryLabel(p, lang)}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <label className="calc-label" htmlFor="montant">{t('calc_label_amount')}</label>
        <div className="calc-input-row">
          <input
            id="montant"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={displayValue}
            onChange={handleChange}
          />
          <span className="calc-suffix">FCFA</span>
        </div>

        <div className="calc-presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`chip${montant === p ? ' active' : ''}`}
              onClick={() => setRaw(String(p))}
            >
              {p.toLocaleString('fr-FR')}
            </button>
          ))}
        </div>

        {zone === 'international' ? (
          <div className="calc-empty" style={{ textAlign: 'left' }}>
            {intlNote}
          </div>
        ) : result && !result.horsGrille ? (
          <div className="calc-result">
            <div className="calc-result-row">
              <span>{t('calc_result_sent')}</span>
              <strong>{fmtFcfa(result.montant)}</strong>
            </div>
            <div className="calc-result-row">
              <span>{t('calc_result_fees')} <em>({fmtTaux(result.tier)})</em></span>
              <strong className="orange">+ {fmtFcfa(result.frais)}</strong>
            </div>
            <div className="calc-result-divider" />
            <div className="calc-result-row total">
              <span>{t('calc_result_total')}</span>
              <strong>{fmtFcfa(result.total)}</strong>
            </div>
            <div className="calc-result-row">
              <span>{t('calc_result_receives')}</span>
              <strong className="blue">{fmtFcfa(result.montant)}</strong>
            </div>
          </div>
        ) : result?.horsGrille ? (
          <div className="calc-empty">{t('calc_out_of_range')}</div>
        ) : (
          <div className="calc-empty">{t('calc_empty')}</div>
        )}

        <div className="calc-note">
          <Info size={13} />
          {zone === 'national' ? t('calc_note_national') : t('calc_note_intl')}
        </div>
      </div>

      {zone === 'national' && (
        <div className="calc-table-wrap">
          <div className="section-title" style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 15 }}>{t('calc_table_title_national')}</h2>
          </div>
          <table className="calc-table">
            <colgroup>
              <col style={{ width: '72%' }} />
              <col style={{ width: '28%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>{t('calc_th_amount')}</th>
                <th>{t('calc_th_fees')}</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => {
                const isCurrent = montant > 0 && montant >= tier.min && montant <= tier.max;
                return (
                  <tr key={tier.min} className={isCurrent ? 'current' : ''}>
                    <td>
                      {tier.min.toLocaleString('fr-FR')} <ArrowRight size={10} style={{ verticalAlign: '-1px', margin: '0 4px' }} /> {tier.max.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td>{fmtTaux(tier)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {zone === 'international' && (
        <div className="calc-table-wrap">
          <div className="section-title" style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 15 }}>{t('calc_table_title_intl')}</h2>
          </div>
          <div className="calc-presets" style={{ marginTop: 0 }}>
            {PAYS_INTERNATIONAL.map((p) => (
              <button key={p} className={`chip${pays === p ? ' active' : ''}`} onClick={() => setPays(p)}>
                {countryLabel(p, lang)}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CalculatorPage;
