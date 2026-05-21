export function Footer() {
  return (
    <footer className="app-footer" aria-label="Créditos">
      <div className="app-footer-left">
        <a
          href="https://spx.ia.br"
          target="_blank"
          rel="noreferrer"
          className="app-footer-spx-wrap"
          aria-label="SPXIA — Intelligence and Automation"
          title="SPXIA — desenvolvedora do software"
        >
          <img
            src="/branding/logo-spx.svg"
            alt="SPXIA"
            className="app-footer-logo app-footer-logo--spx"
          />
        </a>
        <span className="app-footer-text">
          Software desenvolvido pela{' '}
          <a
            href="https://spx.ia.br"
            target="_blank"
            rel="noreferrer"
            className="app-footer-link"
          >
            SPXIA
          </a>
        </span>
      </div>
      <div className="app-footer-right">
        <span className="app-footer-support-label">Apoio</span>
        <img
          src="/branding/logo-gradusvita.png"
          alt="Gradus Vita"
          className="app-footer-logo app-footer-logo--gradusvita"
        />
      </div>
    </footer>
  );
}
