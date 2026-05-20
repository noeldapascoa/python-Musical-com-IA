const btn = document.getElementById('btnRecomendar');
const statusEl = document.getElementById('status');
const resultadoEl = document.getElementById('resultado');

btn.addEventListener('click', async () => {
  const artistas = document.getElementById('artistas').value.trim();
  const musicas = document.getElementById('musicas').value.trim();
  const modo_ia = document.getElementById('modoIa').value;
  const tipo_prompt = document.getElementById('tipoPrompt').value;
  const provedor = document.getElementById('provedor').value;

  btn.disabled = true;
  statusEl.textContent = 'Consultando IA com engenharia de prompts...';
  resultadoEl.innerHTML = '';

  try {
    const resposta = await fetch('/api/recomendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistas, musicas, modo_ia, tipo_prompt, provedor })
    });

    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro desconhecido.');

    mostrarResultado(dados);
    statusEl.textContent = dados.aviso
      ? 'As APIs falharam, mas o sistema usou o modo offline.'
      : `Resposta gerada por: ${dados.provedor_usado || 'IA'}.`;
  } catch (erro) {
    statusEl.textContent = '';
    resultadoEl.innerHTML = `<p class="erro">${escapeHtml(erro.message)}</p>`;
  } finally {
    btn.disabled = false;
  }
});

function escapeHtml(texto) {
  return String(texto || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function mostrarResultado(dados) {
  const artistas = dados.artistas_recomendados || [];
  const musicas = dados.musicas_recomendadas || [];
  const seguranca = dados.seguranca_aplicada || [];
  const comparacao = dados.comparacao_ias || [];

  resultadoEl.innerHTML = `
    <div class="meta">
      <span>Modo: ${escapeHtml(dados.modo_ia || '-')}</span>
      <span>Prompt: ${escapeHtml(dados.tipo_prompt || '-')}</span>
      <span>API: ${escapeHtml(dados.provedor_usado || '-')}</span>
    </div>

    <h3>Seu perfil musical</h3>
    <p>${escapeHtml(dados.perfil || 'Perfil não informado.')}</p>

    <h3>Artistas semelhantes</h3>
    ${artistas.length ? `<ul>${artistas.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}</ul>` : '<p>Nenhum artista recomendado.</p>'}

    <h3>Músicas recomendadas</h3>
    ${musicas.length ? musicas.map((m) => `
      <div class="item-musica">
        <strong>${escapeHtml(m.musica || 'Música')}</strong> - ${escapeHtml(m.artista || 'Artista')}<br>
        <small>${escapeHtml(m.motivo || '')}</small>
      </div>
    `).join('') : '<p>Nenhuma música recomendada.</p>'}

    ${comparacao.length ? `
      <h3>Comparação das IAs</h3>
      <ul>${comparacao.map((c) => `<li>${escapeHtml(c.provedor)}: pontuação ${escapeHtml(c.pontuacao)}</li>`).join('')}</ul>
    ` : ''}

    <h3>Proteções aplicadas</h3>
    ${seguranca.length ? `<ul>${seguranca.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>` : '<p>Validações de segurança ativas.</p>'}

    ${dados.aviso ? `<p class="aviso">${escapeHtml(dados.aviso)}</p>` : ''}
  `;
}
