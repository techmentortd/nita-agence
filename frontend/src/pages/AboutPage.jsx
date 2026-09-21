import { Building2, Smartphone, Wallet, ArrowLeftRight, BookOpen, Headset, ShieldCheck, Phone, Mail, Clock } from 'lucide-react';

export function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <h1>À propos de NITA</h1>
        <p>
          NITA Transfert d'Argent est un réseau de transfert d'argent implanté au Tchad, avec pour mission
          de connecter les Tchadiens grâce à un service fiable, rapide et garanti — à N'Djamena comme dans
          les 23 régions du pays.
        </p>

        <div className="about-stats">
          <div className="stat-pill">
            <div className="n">23</div>
            <div className="l">Régions couvertes</div>
          </div>
          <div className="stat-pill">
            <div className="n">100+</div>
            <div className="l">Agences au Tchad</div>
          </div>
          <div className="stat-pill">
            <div className="n">40</div>
            <div className="l">Agences à N'Djamena</div>
          </div>
        </div>
      </section>

      <section className="about-block">
        <h2><Building2 size={18} /> Qui est NITA ?</h2>
        <p>
          NITA opère au Tchad en s'appuyant sur un large maillage d'agences réparties dans la capitale et
          les provinces, permettant d'envoyer et de retirer des fonds rapidement, sans avoir besoin d'un
          compte bancaire. Le siège du réseau se trouve à Moursal, à N'Djamena.
        </p>
        <p>
          Les transactions sont conçues pour être disponibles instantanément : dès l'envoi effectué en
          agence, le bénéficiaire peut retirer son argent dans n'importe quelle agence NITA de sa région,
          muni d'une pièce d'identité et du code de transfert communiqué par l'expéditeur.
        </p>
      </section>

      <section className="about-block">
        <h2><Smartphone size={18} /> MyNITA — l'application mobile</h2>
        <p>
          En complément du réseau d'agences physiques, NITA propose <strong>MyNITA</strong>, une application
          mobile pensée pour rapprocher les services de transfert d'argent du quotidien des utilisateurs,
          au Tchad comme à l'international. Elle combine la simplicité du digital avec le suivi personnalisé
          qui fait la force du réseau d'agences.
        </p>

        <div className="about-features">
          <div className="about-feature">
            <div className="icon"><ArrowLeftRight size={16} /></div>
            <div>
              <strong>Suivi des transferts</strong>
              <span>Gardez un œil sur vos envois et votre activité financière en temps réel.</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Wallet size={16} /></div>
            <div>
              <strong>Approvisionnement de compte</strong>
              <span>Alimentez votre compte MyNITA pour préparer vos prochains transferts.</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Building2 size={16} /></div>
            <div>
              <strong>Envoi vers une agence</strong>
              <span>Envoyez des fonds à retirer en espèces dans n'importe quelle agence NITA.</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><ArrowLeftRight size={16} /></div>
            <div>
              <strong>Compte à compte</strong>
              <span>Transférez directement entre utilisateurs MyNITA, sans passer par une agence.</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><BookOpen size={16} /></div>
            <div>
              <strong>Informations pratiques</strong>
              <span>Accédez aux ressources et informations utiles du réseau NITA depuis l'application.</span>
            </div>
          </div>
          <div className="about-feature">
            <div className="icon"><Headset size={16} /></div>
            <div>
              <strong>Support client</strong>
              <span>Un accès simplifié à l'assistance NITA en cas de besoin.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-block">
        <h2><ShieldCheck size={18} /> Nos engagements</h2>
        <p>
          Aucun frais supplémentaire n'est facturé au retrait : le bénéficiaire reçoit exactement le montant
          envoyé. Les frais de transfert sont payés uniquement par l'expéditeur, selon une grille tarifaire
          transparente disponible sur la page <a href="/calculatrice" style={{ color: 'var(--orange)', fontWeight: 700 }}>Calculatrice de frais</a>.
        </p>
      </section>

      <section className="about-block">
        <h2><Headset size={18} /> Nous contacter</h2>
        <p>Siège social — Moursal, en face de la CECOCDA, N'Djamena, Tchad.</p>
        <div className="about-contact">
          <a href="tel:+23597787878"><Phone size={13} /> +235 97 78 78 78</a>
          <a href="mailto:contact@tchad.nitatransfert.com"><Mail size={13} /> contact@tchad.nitatransfert.com</a>
          <span className="about-contact-hours" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--t2)', padding: '8px 4px' }}>
            <Clock size={13} /> 7h - 23h, tous les jours
          </span>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
