interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Sobre o LegoB"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal about-modal">
        <header className="modal-header">
          <h2>Sobre o LegoB</h2>
          <button type="button" onClick={onClose} aria-label="Fechar diálogo">
            ×
          </button>
        </header>

        <div className="modal-body">
          <p>
            <strong>LegoB</strong> é um jogo de montagem 3D de peças no navegador. Construa
            livremente no modo <em>Livre</em> ou siga passo a passo no modo <em>Instruções</em>.
            Tudo roda no próprio navegador — sem conta, sem servidor, suas criações ficam
            guardadas apenas neste dispositivo.
          </p>

          <h3>Créditos</h3>
          <div className="about-credits">
            <div className="about-credit about-credit--spx">
              <img
                src="/branding/logo-spx.svg"
                alt="SPXIA"
                className="about-credit-logo about-credit-logo--spx"
              />
              <div className="about-credit-text">
                <strong>
                  <a href="https://spx.ia.br" target="_blank" rel="noreferrer">
                    SPXIA
                  </a>
                </strong>
                <span>Desenvolvedora do software e da tecnologia</span>
              </div>
            </div>
            <div className="about-credit">
              <img
                src="/branding/logo-gradusvita.png"
                alt="Gradus Vita"
                className="about-credit-logo about-credit-logo--gradusvita"
              />
              <div className="about-credit-text">
                <strong>Gradus Vita</strong>
                <span>Apoiadora</span>
              </div>
            </div>
          </div>

          <h3>Atalhos de teclado</h3>
          <dl className="shortcut-list">
            <dt><kbd>Esc</kbd></dt>
            <dd>Desselecionar / limpar peça ativa da paleta</dd>
            <dt><kbd>R</kbd> / <kbd>Shift</kbd>+<kbd>R</kbd></dt>
            <dd>Girar peça selecionada no sentido horário / anti-horário</dd>
            <dt><kbd>Del</kbd> / <kbd>Backspace</kbd></dt>
            <dd>Excluir peça selecionada</dd>
            <dt><kbd>←</kbd> / <kbd>→</kbd></dt>
            <dd>Passo anterior / próximo nas instruções</dd>
            <dt><kbd>Espaço</kbd></dt>
            <dd>Reproduzir / pausar as instruções</dd>
            <dt><kbd>Home</kbd> / <kbd>End</kbd></dt>
            <dd>Primeiro / último passo das instruções</dd>
            <dt><kbd>G</kbd></dt>
            <dd>Alternar prévia fantasma no modo Instruções</dd>
          </dl>

          <h3>Atribuição</h3>
          <p>
            A geometria das peças e os códigos de cor seguem a especificação do{' '}
            <a href="https://www.ldraw.org/" target="_blank" rel="noreferrer">
              LDraw.org
            </a>
            . A Biblioteca de Peças LDraw é distribuída sob a{' '}
            <a
              href="https://www.ldraw.org/article/398.html"
              target="_blank"
              rel="noreferrer"
            >
              Licença Creative Commons Attribution 2.0 (CCAL 2.0)
            </a>
            .
          </p>

          <h3>Não afiliado ao LEGO Group</h3>
          <p>
            LegoB é um <strong>projeto não oficial feito por fãs</strong>. NÃO é afiliado,
            endossado ou patrocinado pelo LEGO Group. "LEGO" é marca registrada do LEGO Group.
            O codinome "LegoB" é interno e pode mudar.
          </p>

          <h3>Privacidade</h3>
          <p>
            Nenhum dado pessoal é coletado. Sem rastreadores. Todos os salvos ficam no IndexedDB
            do seu navegador e podem ser apagados a qualquer momento no diálogo "Meus salvos".
          </p>
        </div>
      </div>
    </div>
  );
}
