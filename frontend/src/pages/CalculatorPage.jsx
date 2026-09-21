import { useMemo, useState } from 'react';
import { Calculator, ArrowRight, Info, Globe2 } from 'lucide-react';
import { calculerFrais, fmtFcfa, fmtTaux, TIERS, PAYS_INTERNATIONAL } from '../utils/frais';

const PRESETS = [5000, 25000, 100000, 250000, 500000, 1000000];

export function CalculatorPage() {
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

  return (
    <section className="section" style={{ maxWidth: 720 }}>
      <div className="calc-head">
        <div className="calc-icon">
          <Calculator size={20} />
        </div>
        <div className="calc-head-text">
          <h1>Calculatrice de frais</h1>
          <p>Estimez les frais d'un transfert NITA, au Tchad ou vers l'international.</p>
        </div>
      </div>

      <div className="calc-zone-tabs">
        <button className={zone === 'national' ? 'active' : ''} onClick={() => setZone('national')}>
          Tchad (national)
        </button>
        <button className={zone === 'international' ? 'active' : ''} onClick={() => setZone('international')}>
          <Globe2 size={13} /> Autre pays
        </button>
      </div>

      <div className="calc-card">
        {zone === 'international' && (
          <>
            <label className="calc-label" htmlFor="pays">Pays de destination</label>
            <div className="login-field" style={{ marginBottom: 16 }}>
              <select id="pays" value={pays} onChange={(e) => setPays(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 14, color: 'var(--t1)', fontFamily: 'inherit' }}>
                {PAYS_INTERNATIONAL.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <label className="calc-label" htmlFor="montant">Montant à envoyer</label>
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
            NITA est présent dans plusieurs pays d'Afrique de l'Ouest et du Centre, dont le {pays}. Le site
            officiel ne publie pas de grille tarifaire en ligne pour les transferts internationaux — les frais
            vers le {pays} sont communiqués directement en agence NITA au moment de l'envoi.
          </div>
        ) : result && !result.horsGrille ? (
          <div className="calc-result">
            <div className="calc-result-row">
              <span>Montant envoyé</span>
              <strong>{fmtFcfa(result.montant)}</strong>
            </div>
            <div className="calc-result-row">
              <span>Frais <em>({fmtTaux(result.tier)})</em></span>
              <strong className="orange">+ {fmtFcfa(result.frais)}</strong>
            </div>
            <div className="calc-result-divider" />
            <div className="calc-result-row total">
              <span>Total à payer par l'expéditeur</span>
              <strong>{fmtFcfa(result.total)}</strong>
            </div>
            <div className="calc-result-row">
              <span>Le destinataire reçoit</span>
              <strong className="blue">{fmtFcfa(result.montant)}</strong>
            </div>
          </div>
        ) : result?.horsGrille ? (
          <div className="calc-empty">Montant hors grille (max. 25 000 000 FCFA) — contactez une agence NITA.</div>
        ) : (
          <div className="calc-empty">Saisissez un montant pour voir les frais.</div>
        )}

        <div className="calc-note">
          <Info size={13} />
          {zone === 'national'
            ? 'Grille tarifaire officielle NITA (zone nationale) — aucun frais supplémentaire n\'est facturé au retrait.'
            : 'Zone internationale : montant indicatif, les frais réels sont fixés en agence selon le pays et le mode de retrait.'}
        </div>
      </div>

      {zone === 'national' && (
        <div className="calc-table-wrap">
          <div className="section-title" style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 15 }}>Grille tarifaire — National</h2>
          </div>
          <table className="calc-table">
            <colgroup>
              <col style={{ width: '72%' }} />
              <col style={{ width: '28%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Montant</th>
                <th>Frais</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => {
                const isCurrent = montant > 0 && montant >= t.min && montant <= t.max;
                return (
                  <tr key={t.min} className={isCurrent ? 'current' : ''}>
                    <td>
                      {t.min.toLocaleString('fr-FR')} <ArrowRight size={10} style={{ verticalAlign: '-1px', margin: '0 4px' }} /> {t.max.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td>{fmtTaux(t)}</td>
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
            <h2 style={{ fontSize: 15 }}>Pays desservis par NITA</h2>
          </div>
          <div className="calc-presets" style={{ marginTop: 0 }}>
            {PAYS_INTERNATIONAL.map((p) => (
              <button key={p} className={`chip${pays === p ? ' active' : ''}`} onClick={() => setPays(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CalculatorPage;
