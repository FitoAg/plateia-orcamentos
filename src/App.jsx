import { useState, useEffect } from "react"

const P = "#7ED44C", CY = "#7ED44C", PK = "#b8f07e"
const BG = "#080808", C1 = "#0f0f0f", C2 = "#161616", C3 = "#1e1e1e", BR = "#252525"

const CAT_LABELS = {
  iluminacao: "Iluminação", sonorizacao: "Sonorização", video: "Vídeo",
  estrutura: "Estrutura", projeto: "Projeto", equipe: "Equipe Técnica"
}

const CATALOG0 = [
  {id:"atomic",nome:"Atomic",cat:"iluminacao",preco:100,desc:true,sub:false},
  {id:"cob_led",nome:"COB LED",cat:"iluminacao",preco:100,desc:true,sub:false},
  {id:"man_power",nome:"Man Power",cat:"iluminacao",preco:300,desc:true,sub:false},
  {id:"maq_fumaca",nome:"Máquina de Fumaça Haze",cat:"iluminacao",preco:150,desc:true,sub:false},
  {id:"mesa_luz",nome:"Mesa de Luz MA Command Wing",cat:"iluminacao",preco:350,desc:true,sub:false},
  {id:"moving_beam",nome:"Moving Beam 9R",cat:"iluminacao",preco:150,desc:true,sub:false},
  {id:"moving_wash",nome:"Moving Wash LED",cat:"iluminacao",preco:150,desc:true,sub:false},
  {id:"par_led",nome:"Par LED 12x18W",cat:"iluminacao",preco:50,desc:true,sub:false},
  {id:"ribalta",nome:"Ribalta LED Pixel",cat:"iluminacao",preco:100,desc:true,sub:false},
  {id:"ilum_extra",nome:"Iluminação Extra Externa",cat:"iluminacao",preco:4000,desc:true,sub:false},
  {id:"ev30",nome:"Caixas de Coluna EV30",cat:"sonorizacao",preco:350,desc:true,sub:false},
  {id:"mesa_som",nome:"Mesa de Som",cat:"sonorizacao",preco:250,desc:true,sub:false},
  {id:"rack_mic",nome:"Rack Microfone Sem Fio (3B+1H)",cat:"sonorizacao",preco:800,desc:true,sub:false},
  {id:"som_dj",nome:"Som Externo DJ",cat:"sonorizacao",preco:1500,desc:true,sub:false},
  {id:"tv70",nome:'TV 70"',cat:"video",preco:700,desc:true,sub:false},
  {id:"tv50",nome:'TV 50"',cat:"video",preco:500,desc:true,sub:false},
  {id:"tv40",nome:'TV 40"',cat:"video",preco:400,desc:true,sub:false},
  {id:"painel_5x3",nome:"Painel LED 5×3m Semi Curvo",cat:"video",preco:5250,desc:true,sub:false},
  {id:"painel_2x1",nome:"Painel LED 2,5×1,5m",cat:"video",preco:2100,desc:true,sub:false},
  {id:"eq_video",nome:"Equipe Vídeo",cat:"video",preco:2400,desc:false,sub:false},
  {id:"q30",nome:"Metro Linear Q30",cat:"estrutura",preco:50,desc:true,sub:false},
  {id:"capa_q30",nome:"Capa Preta Box Q30",cat:"estrutura",preco:30,desc:true,sub:false},
  {id:"proj_tc",nome:"Projetor Iluminação Time Code",cat:"projeto",preco:3000,desc:true,sub:false},
  {id:"tec_som",nome:"Técnico de Som",cat:"equipe",preco:450,desc:false,sub:false},
  {id:"tec_luz",nome:"Técnico de Luz",cat:"equipe",preco:450,desc:false,sub:false},
  {id:"tec_res",nome:"Técnico de Resolume",cat:"equipe",preco:500,desc:false,sub:false},
  {id:"tec_cont",nome:"Técnico de Conteúdo",cat:"equipe",preco:450,desc:false,sub:false},
  {id:"aux_mont",nome:"Auxiliar Montagem Vídeo",cat:"equipe",preco:350,desc:false,sub:false},
  {id:"montador",nome:"Montador/Carregadores",cat:"equipe",preco:200,desc:false,sub:false},
  {id:"logistica",nome:"Logística",cat:"equipe",preco:1500,desc:false,sub:false},
]

function precoEfetivo(item) {
  return item.sub ? item.preco * 1.275 : item.preco
}
function calcFullPrice(item, qtd, dias) {
  if (!qtd || !dias || qtd <= 0 || dias <= 0) return 0
  return qtd * precoEfetivo(item) * dias
}
function calcDesconto(item, qtd, dias) {
  if (!item.desc || !qtd || !dias || dias <= 1) return 0
  return qtd * precoEfetivo(item) * (dias - 1) * 0.5
}
function calcItem(item, qtd, dias) {
  return calcFullPrice(item, qtd, dias) - calcDesconto(item, qtd, dias)
}

function R$(v) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0)
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5) }
function hoje() { return new Date().toISOString().slice(0, 10) }
function fmtData(s) { if (!s) return "—"; const [y, m, d] = s.split("-"); return `${d}/${m}/${y}` }

const inputStyle = {
  background: C3, border: `1px solid ${BR}`, color: "#fff",
  borderRadius: 6, padding: "8px 12px", fontSize: 13, outline: "none",
  fontFamily: "'DM Sans', sans-serif"
}

const btnPrimary = {
  background: P, color: "#fff", border: "none", borderRadius: 6,
  padding: "9px 18px", fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
}

const btnGhost = {
  background: "transparent", color: "#aaa", border: `1px solid ${BR}`,
  borderRadius: 6, padding: "9px 18px", fontSize: 13, fontWeight: 500,
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
}

function Badge({ children, color = P }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 7px", borderRadius: 4,
      fontSize: 10, fontWeight: 700, background: color + "22",
      color, border: `1px solid ${color}44`, marginLeft: 5
    }}>
      {children}
    </span>
  )
}

function gerarHTMLImpressao(orc) {
  const byCat = {}
  orc.itens.forEach(i => { if (!byCat[i.cat]) byCat[i.cat] = []; byCat[i.cat].push(i) })
  const equipCats = Object.entries(byCat).filter(([c]) => c !== "equipe")
  const equipRows = equipCats.map(([cat, items]) => `
    <tr><td colspan="5" style="background:#f0fbe8;padding:9px 12px;font-size:10px;font-weight:700;color:#2d6a00;text-transform:uppercase;letter-spacing:1px">${CAT_LABELS[cat]}</td></tr>
    ${items.map(i => `<tr>
      <td style="padding:8px 12px;font-size:13px">${i.nome}${i.sub ? '<span style="background:#d4f5b0;color:#2d6a00;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:700;margin-left:6px">sublocado</span>' : ""}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:center">${i.qtd}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:center">${i.dias || orc.dias}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:right">${R$(i.preco)}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:right;color:#999;text-decoration:line-through">${R$(i.fullPrice || i.total)}</td>
    </tr>`).join("")}
  `).join("")
  const descontoRow = orc.equipDesc > 0 ? `
    <tr style="background:#f0fce8">
      <td colspan="4" style="padding:12px 12px;font-size:13px;font-weight:700;color:#2d7d00">
        Desconto locação estendida <span style="font-weight:400;font-size:11px;color:#666">(50% off a partir do 2º dia)</span>
      </td>
      <td style="padding:12px 12px;font-size:15px;font-weight:700;color:#2d7d00;text-align:right">- ${R$(orc.equipDesc)}</td>
    </tr>
    <tr>
      <td colspan="4" style="padding:8px 12px;font-size:13px;font-weight:600;color:#333;text-align:right">Subtotal equipamentos</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:700;color:#3d8b00;text-align:right">${R$(orc.equipNet)}</td>
    </tr>` : ""
  const equipeRows = byCat["equipe"] ? `
    <tr><td colspan="5" style="background:#f5f5f5;padding:9px 12px;font-size:10px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px">Equipe Técnica</td></tr>
    ${byCat["equipe"].map(i => `<tr>
      <td style="padding:8px 12px;font-size:13px">${i.nome}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:center">${i.qtd}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:center">${i.dias || orc.dias}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:right">${R$(i.preco)}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;text-align:right">${R$(i.total)}</td>
    </tr>`).join("")}
    <tr>
      <td colspan="4" style="padding:8px 12px;font-size:13px;font-weight:600;color:#333;text-align:right">Subtotal equipe</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;text-align:right">${R$(orc.equipeTotal)}</td>
    </tr>` : ""
  const rows = equipRows + descontoRow + equipeRows
  return `<!DOCTYPE html><html><head><title>Orçamento — ${orc.cliente}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    body{font-family:'DM Sans',sans-serif;background:#fff;color:#111;padding:40px;max-width:800px;margin:0 auto}
    table{width:100%;border-collapse:collapse}th{background:#111;color:#fff;padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-align:left}
    tr{border-bottom:1px solid #eee}
    .header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #7ED44C}
    .logo{font-size:22px;font-weight:700}.accent{color:#7ED44C}
    .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:28px}
    .meta label{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px}
    .meta span{font-size:14px;font-weight:600}
    .total-section{margin-top:20px;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .total-line{display:flex;gap:32px;font-size:13px;color:#666}
    .total-final{display:flex;gap:32px;font-size:20px;font-weight:700;color:#7ED44C;border-top:2px solid #111;padding-top:12px;margin-top:6px}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
  <div class="header">
    <div><div class="logo">Plateia <span class="accent">Produções</span></div><div style="font-size:12px;color:#999;margin-top:4px">Proposta Comercial de Audiovisual</div></div>
    <div style="text-align:right;font-size:12px;color:#999">Emitido em: ${fmtData(hoje())}<br>Válido por 30 dias</div>
  </div>
  <div class="meta">
    <div><label>Cliente</label><span>${orc.cliente}</span></div>
    <div><label>Evento</label><span>${orc.evento}</span></div>
    <div><label>Data / Período</label><span>${fmtData(orc.data)} · ${orc.dias} dia${orc.dias > 1 ? "s" : ""}</span></div>
  </div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:center">Qtd</th><th style="text-align:center">Dias</th><th style="text-align:right">Unit./dia</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="total-section">
    ${orc.impV > 0 ? `<div class="total-line"><span>Subtotal</span><span>${R$(orc.subtotal)}</span></div><div class="total-line"><span>Imposto (12%)</span><span>${R$(orc.impV)}</span></div>` : ""}
    <div class="total-final"><span>Total</span><span>${R$(orc.total)}</span></div>
  </div>
  <div class="footer">Plateia Produções · contato@plateiaproducoes.com.br · Esta proposta é válida por 30 dias a partir da data de emissão.</div>
  </body></html>`
}

function ModalPdf({ orc, onClose }) {
  const byCat = {}
  orc.itens.forEach(i => { if (!byCat[i.cat]) byCat[i.cat] = []; byCat[i.cat].push(i) })

  function imprimir() {
    const html = gerarHTMLImpressao(orc)
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orcamento_${orc.cliente.replace(/\s+/g, "_")}_${orc.data}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}>
      <div style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 14, maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${BR}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: C1, zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "1px", marginBottom: 3 }}>ORÇAMENTO GERADO</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{orc.cliente} <span style={{ color: "#555", fontWeight: 400, fontSize: 13 }}>— {orc.evento}</span></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={imprimir} style={{ ...btnPrimary, fontSize: 12, padding: "7px 16px" }}>Imprimir / PDF</button>
            <button onClick={onClose} style={{ ...btnGhost, fontSize: 18, padding: "4px 12px", lineHeight: 1 }}>×</button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
            {[["Data", fmtData(orc.data)], ["Dias", `${orc.dias} dia${orc.dias > 1 ? "s" : ""}`], ["Itens", orc.itens.length]].map(([l, v]) => (
              <div key={l} style={{ background: C2, borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Equipamentos */}
          {Object.entries(byCat).filter(([c]) => c !== "equipe").map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1px", marginBottom: 8 }}>{CAT_LABELS[cat].toUpperCase()}</div>
              {items.map(i => (
                <div key={i.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${BR}`, gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 13 }}>{i.nome}{i.sub && <Badge color={PK}>sublocado</Badge>}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{i.qtd}× · {i.dias || orc.dias}d</div>
                  <div style={{ fontSize: 13, color: orc.equipDesc > 0 ? "#555" : CY, textDecoration: orc.equipDesc > 0 ? "line-through" : "none", minWidth: 95, textAlign: "right" }}>{R$(i.fullPrice || i.total)}</div>
                </div>
              ))}
            </div>
          ))}

          {orc.equipDesc > 0 && (
            <div style={{ background: P + "18", border: `1px solid ${P}44`, borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: P }}>DESCONTO LOCAÇÃO ESTENDIDA</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>50% off a partir do 2º dia em todos os equipamentos</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: P }}>- {R$(orc.equipDesc)}</div>
            </div>
          )}

          {orc.equipNet != null && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${BR}` }}>
              <span>Subtotal equipamentos</span>
              <span style={{ color: CY, fontWeight: 600 }}>{R$(orc.equipNet)}</span>
            </div>
          )}

          {byCat["equipe"] && (<>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1px", marginBottom: 8 }}>EQUIPE TÉCNICA</div>
            {byCat["equipe"].map(i => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${BR}`, gap: 8 }}>
                <div style={{ flex: 1, fontSize: 13 }}>{i.nome}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{i.qtd}× · {i.dias || orc.dias}d</div>
                <div style={{ fontSize: 13, color: "#aaa", minWidth: 95, textAlign: "right" }}>{R$(i.total)}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", margin: "8px 0 16px", paddingBottom: 16, borderBottom: `1px solid ${BR}` }}>
              <span>Subtotal equipe</span><span>{R$(orc.equipeTotal)}</span>
            </div>
          </>)}

          <div style={{ paddingTop: 4 }}>
            {orc.impV > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
                <span>Imposto (12%)</span><span>{R$(orc.impV)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: CY }}>{R$(orc.total)}</span>
            </div>
          </div>

          <div style={{ marginTop: 16, background: P + "11", border: `1px solid ${P}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#888", textAlign: "center" }}>
            Orçamento salvo no histórico · clique em "Imprimir / PDF" para gerar o documento
          </div>
        </div>
      </div>
    </div>
  )
}

function TabNovo({ form, setForm, qtds, setQtds, itemDias, setItemDias, getDias, catF, setCatF, busca, setBusca, catalog, gerar, editingId, cancelEdit, buscarItensIA, buscandoIA, iaResultCount, setIaResultCount }) {
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const [buscaTexto, setBuscaTexto] = useState("")
  const sel = catalog.filter(i => (qtds[i.id] || 0) > 0)
  const equip = sel.filter(i => i.cat !== "equipe")
  const equipe = sel.filter(i => i.cat === "equipe")

  const equipFull = equip.reduce((s, i) => s + calcFullPrice(i, qtds[i.id], getDias(i.id)), 0)
  const equipDesc = equip.reduce((s, i) => s + calcDesconto(i, qtds[i.id], getDias(i.id)), 0)
  const equipNet  = equipFull - equipDesc
  const equipeTotal = equipe.reduce((s, i) => s + calcItem(i, qtds[i.id], getDias(i.id)), 0)
  const subtotal = equipNet + equipeTotal
  const impV = form.imposto ? subtotal * 0.12 : 0
  const total = subtotal + impV

  const catF2 = catalog.filter(i =>
    (catF === "selecionados" ? (qtds[i.id] || 0) > 0 : (catF === "todos" || i.cat === catF)) &&
    (!busca || i.nome.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div>
      {/* Busca Inteligente */}
      <div style={{ background: C1, border: `1px solid ${P}44`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: "1px", marginBottom: 10 }}>BUSCA INTELIGENTE</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <textarea
              placeholder={"Ex: painel de led 5x3, 2 técnicos de som, mesa de luz, logística..."}
              value={buscaTexto}
              onChange={e => { setBuscaTexto(e.target.value); setIaResultCount(0) }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); buscarItensIA(buscaTexto) } }}
              rows={2}
              style={{ ...inputStyle, width: "100%", resize: "none", lineHeight: 1.5 }}
            />
            {iaResultCount > 0 && (
              <div style={{ fontSize: 11, color: P, marginTop: 6 }}>
                ✓ {iaResultCount} iten{iaResultCount > 1 ? "s identificados" : " identificado"} — ajuste as quantidades abaixo se necessário
              </div>
            )}
          </div>
          <button
            onClick={() => buscarItensIA(buscaTexto)}
            disabled={buscandoIA || !buscaTexto.trim()}
            style={{ ...btnPrimary, padding: "10px 18px", fontSize: 13, opacity: buscandoIA || !buscaTexto.trim() ? 0.5 : 1, whiteSpace: "nowrap", minWidth: 120 }}
          >
            {buscandoIA ? "Buscando..." : "Identificar →"}
          </button>
        </div>
      </div>
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
      {/* Left: form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1px", marginBottom: 16 }}>DADOS DO EVENTO</div>
          {[["Cliente", "cliente", "text"], ["Evento / Projeto", "evento", "text"]].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>{label}</div>
              <input type={type} value={form[key]} onChange={e => f(key, e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Data</div>
              <input type="date" value={form.data} onChange={e => f("data", e.target.value)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Dias</div>
              <input type="number" min={1} value={form.dias} onChange={e => f("dias", Math.max(1, parseInt(e.target.value) || 1))} style={{ ...inputStyle, width: "100%" }} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#777" }}>
            <input type="checkbox" checked={form.imposto} onChange={e => f("imposto", e.target.checked)} />
            Incluir imposto (12%)
          </label>
        </div>

        {sel.length > 0 && (
          <div style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1px", marginBottom: 14 }}>RESUMO</div>

            {equip.length > 0 && (<>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.5px", marginBottom: 8 }}>EQUIPAMENTOS</div>
              {equip.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5, color: "#aaa" }}>
                  <span style={{ flex: 1 }}>{qtds[i.id]}× {i.nome}</span>
                  <span style={{ color: "#555", marginRight: 8, fontSize: 11 }}>{getDias(i.id)}d</span>
                  <span style={{ textDecoration: equipDesc > 0 ? "line-through" : "none", color: equipDesc > 0 ? "#555" : CY }}>
                    {R$(calcFullPrice(i, qtds[i.id], getDias(i.id)))}
                  </span>
                </div>
              ))}
              {equipDesc > 0 && (
                <div style={{ background: P + "18", border: `1px solid ${P}44`, borderRadius: 8, padding: "10px 12px", margin: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: P }}>DESCONTO LOCAÇÃO ESTENDIDA</div>
                    <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>50% off a partir do 2º dia</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: P }}>- {R$(equipDesc)}</div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#ccc", marginBottom: 10 }}>
                <span>Subtotal equipamentos</span>
                <span style={{ color: CY }}>{R$(equipNet)}</span>
              </div>
            </>)}

            {equipe.length > 0 && (<>
              <div style={{ borderTop: `1px solid ${BR}`, paddingTop: 10, marginBottom: 8 }} />
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.5px", marginBottom: 8 }}>EQUIPE TÉCNICA</div>
              {equipe.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5, color: "#aaa" }}>
                  <span style={{ flex: 1 }}>{qtds[i.id]}× {i.nome}</span>
                  <span style={{ color: "#555", marginRight: 8, fontSize: 11 }}>{getDias(i.id)}d</span>
                  <span style={{ color: "#aaa" }}>{R$(calcItem(i, qtds[i.id], getDias(i.id)))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#ccc", marginBottom: 4 }}>
                <span>Subtotal equipe</span>
                <span>{R$(equipeTotal)}</span>
              </div>
            </>)}

            <div style={{ borderTop: `1px solid ${BR}`, marginTop: 10, paddingTop: 10 }} />
            {form.imposto && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 6 }}>
                <span>Imposto 12%</span><span>{R$(impV)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: CY }}>{R$(total)}</span>
            </div>
          </div>
        )}

        {editingId && (
          <div style={{ background: "#1a1400", border: "1px solid #665500", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#aaa" }}>Editando orçamento existente</span>
            <button onClick={cancelEdit} style={{ ...btnGhost, fontSize: 11, padding: "4px 10px", color: "#888" }}>Cancelar</button>
          </div>
        )}
        <button onClick={gerar} style={{ ...btnPrimary, width: "100%", padding: 12, fontSize: 14 }}>
          {editingId ? "Salvar Alterações →" : "Gerar Orçamento →"}
        </button>
      </div>

      {/* Right: item picker */}
      <div style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 0", borderBottom: `1px solid ${BR}` }}>
          <input placeholder="Buscar item..." value={busca} onChange={e => setBusca(e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 12 }}>
            {[["selecionados", "Selecionados"], ["todos", "Todos"], ...Object.entries(CAT_LABELS)].map(([id, label]) => (
              <button key={id} onClick={() => setCatF(id)} style={{
                background: catF === id ? P + "22" : "transparent",
                border: `1px solid ${catF === id ? P : BR}`,
                color: catF === id ? P : "#666",
                borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {catF2.length === 0
            ? <div style={{ padding: 24, color: "#444", fontSize: 13, textAlign: "center" }}>Nenhum item encontrado.</div>
            : catF2.map(item => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", padding: "9px 16px",
                borderBottom: `1px solid ${BR}`, gap: 8,
                background: (qtds[item.id] || 0) > 0 ? P + "11" : "transparent"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{item.nome}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 11, color: "#555" }}>{CAT_LABELS[item.cat]}</span>
                    {item.desc && <Badge color={P}>desc/dia</Badge>}
                    {item.sub && <Badge color={PK}>sublocado</Badge>}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: CY, fontWeight: 600, minWidth: 75, textAlign: "right" }}>
                  {R$(item.preco)}/dia
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qtd</span>
                  <input
                    type="number" min={0} placeholder="0"
                    value={qtds[item.id] || ""}
                    onChange={e => {
                      const v = parseInt(e.target.value) || 0
                      setQtds(p => ({ ...p, [item.id]: v }))
                    }}
                    style={{ ...inputStyle, width: 54, textAlign: "center", padding: "5px 6px" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Dias</span>
                  <input
                    type="number" min={1} placeholder={form.dias}
                    value={itemDias[item.id] != null ? itemDias[item.id] : ""}
                    onChange={e => {
                      const v = parseInt(e.target.value)
                      if (isNaN(v) || e.target.value === "") {
                        setItemDias(p => { const n = {...p}; delete n[item.id]; return n })
                      } else {
                        setItemDias(p => ({ ...p, [item.id]: Math.max(1, v) }))
                      }
                    }}
                    style={{ ...inputStyle, width: 54, textAlign: "center", padding: "5px 6px",
                      borderColor: itemDias[item.id] != null ? P : BR,
                      color: itemDias[item.id] != null ? P : "#777"
                    }}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  )
}

function TabHistorico({ orcs, onView, onEdit, onStatus }) {
  if (orcs.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◎</div>
      <div style={{ fontSize: 14 }}>Nenhum orçamento gerado ainda.</div>
    </div>
  )

  const mesAtual = new Date().toISOString().slice(0, 7)
  const totalAcum = orcs.reduce((s, o) => s + o.total, 0)
  const totalMes = orcs.filter(o => o.criado.slice(0, 7) === mesAtual).reduce((s, o) => s + o.total, 0)
  const aprovados = orcs.filter(o => o.status === "aprovado")
  const totalAprovado = aprovados.reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Total orçamentos", orcs.length, "#aaa"],
          ["Acumulado gerado", R$(totalAcum), CY],
          ["Aprovados", aprovados.length, P],
          ["Receita aprovada", R$(totalAprovado), P],
        ].map(([label, val, cor]) => (
          <div key={label} style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 6, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: cor }}>{val}</div>
          </div>
        ))}
      </div>
      {orcs.map(o => (
        <div key={o.id} style={{
          background: C1,
          border: `1px solid ${o.status === "aprovado" ? P+"55" : o.status === "declinado" ? "#e74c3c55" : BR}`,
          borderRadius: 10, padding: "14px 20px", marginBottom: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{o.cliente}</span>
                {o.status === "aprovado" && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: P+"22", color: P, border: `1px solid ${P}44` }}>APROVADO</span>}
                {o.status === "declinado" && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#e74c3c22", color: "#e74c3c", border: "1px solid #e74c3c44" }}>RECUSADO</span>}
                {!o.status && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#222", color: "#666" }}>PENDENTE</span>}
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>{o.evento} · {fmtData(o.data)} · {o.dias} dia{o.dias > 1 ? "s" : ""} · {o.itens.length} itens</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: CY }}>{R$(o.total)}</div>
              {o.impV > 0 && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>incl. imposto</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, borderTop: `1px solid ${BR}`, paddingTop: 10 }}>
            <button onClick={() => onView(o)} style={{ ...btnGhost, fontSize: 12, padding: "5px 12px" }}>Ver PDF</button>
            <button onClick={() => onEdit(o)} style={{ ...btnGhost, fontSize: 12, padding: "5px 12px" }}>Editar</button>
            <div style={{ flex: 1 }} />
            <button onClick={() => onStatus(o.id, "aprovado")} style={{
              background: o.status === "aprovado" ? P+"33" : "transparent",
              border: `1px solid ${o.status === "aprovado" ? P : BR}`,
              color: o.status === "aprovado" ? P : "#666",
              borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif"
            }}>
              {"✓ Aprovado"}
            </button>
            <button onClick={() => onStatus(o.id, "declinado")} style={{
              background: o.status === "declinado" ? "#e74c3c22" : "transparent",
              border: `1px solid ${o.status === "declinado" ? "#e74c3c" : BR}`,
              color: o.status === "declinado" ? "#e74c3c" : "#666",
              borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif"
            }}>
              {"✗ Recusado"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabCatalogo({ catalog, onSave }) {
  const [local, setLocal] = useState(catalog)
  const [dirty, setDirty] = useState(false)

  const upd = (id, field, val) => {
    setLocal(p => p.map(i => i.id === id ? { ...i, [field]: val } : i))
    setDirty(true)
  }

  return (
    <div>
      {dirty && (
        <div style={{ background: P + "15", border: `1px solid ${P}44`, borderRadius: 8, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>Alterações não salvas</span>
          <button onClick={() => { onSave(local); setDirty(false) }} style={{ ...btnPrimary, fontSize: 12, padding: "6px 14px" }}>Salvar catálogo</button>
        </div>
      )}
      {Object.entries(CAT_LABELS).map(([cat, label]) => {
        const items = local.filter(i => i.cat === cat)
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1px", marginBottom: 8 }}>{label.toUpperCase()}</div>
            <div style={{ background: C1, border: `1px solid ${BR}`, borderRadius: 10, overflow: "hidden" }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", padding: "10px 16px", gap: 12,
                  borderBottom: idx < items.length - 1 ? `1px solid ${BR}` : "none"
                }}>
                  <div style={{ flex: 1, fontSize: 13 }}>{item.nome}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 11, color: "#555" }}>R$</span>
                    <input
                      type="number" min={0} value={item.preco}
                      onChange={e => upd(item.id, "preco", parseFloat(e.target.value) || 0)}
                      style={{ ...inputStyle, width: 80, textAlign: "right", color: CY, padding: "5px 8px" }}
                    />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666", cursor: "pointer", whiteSpace: "nowrap" }}>
                    <input type="checkbox" checked={item.desc} onChange={e => upd(item.id, "desc", e.target.checked)} />
                    desc/dia
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666", cursor: "pointer", whiteSpace: "nowrap" }}>
                    <input type="checkbox" checked={item.sub} onChange={e => upd(item.id, "sub", e.target.checked)} />
                    sublocado
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState("novo")
  const [catalog, setCatalog] = useState(CATALOG0)
  const [orcs, setOrcs] = useState([])
  const [form, setForm] = useState({ cliente: "", evento: "", data: hoje(), dias: 1, imposto: false })
  const [qtds, setQtds] = useState({})
  const [itemDias, setItemDias] = useState({})
  const [catF, setCatF] = useState("todos")
  const [busca, setBusca] = useState("")
  const [modal, setModal] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [buscandoIA, setBuscandoIA] = useState(false)
  const [iaResultCount, setIaResultCount] = useState(0)

  useEffect(() => {
    function load() {
      try { const r = localStorage.getItem("plateia_orcs"); if (r) setOrcs(JSON.parse(r)) } catch {}
      try { const r = localStorage.getItem("plateia_cat"); if (r) setCatalog(JSON.parse(r)) } catch {}
      setLoaded(false)  // set true after load
      setLoaded(true)
    }
    load()
  }, [])

  const getDias = (id) => itemDias[id] != null ? itemDias[id] : form.dias

  function startEdit(orc) {
    setForm({ cliente: orc.cliente, evento: orc.evento, data: orc.data, dias: orc.dias, imposto: orc.imposto })
    const newQtds = {}, newItemDias = {}
    orc.itens.forEach(i => {
      newQtds[i.id] = i.qtd
      if (i.dias && i.dias !== orc.dias) newItemDias[i.id] = i.dias
    })
    setQtds(newQtds)
    setItemDias(newItemDias)
    setEditingId(orc.id)
    setTab("novo")
  }

  async function updateStatus(id, status) {
    const novo = orcs.map(o => o.id === id ? { ...o, status: o.status === status ? null : status } : o)
    try { localStorage.setItem("plateia_orcs", JSON.stringify(novo)) } catch {}
    setOrcs(novo)
  }

  function cancelEdit() {
    setEditingId(null)
    setQtds({})
    setItemDias({})
    setForm({ cliente: "", evento: "", data: hoje(), dias: 1, imposto: false })
  }

  async function buscarItensIA(texto) {
    if (!texto.trim()) return
    setBuscandoIA(true)
    try {
      const catalogoSimples = catalog.map(i => ({ id: i.id, nome: i.nome, cat: CAT_LABELS[i.cat] }))
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um assistente de orçamentos de audiovisual da Plateia Produções.

Catálogo disponível (JSON):
${JSON.stringify(catalogoSimples)}

O usuário descreveu o que precisa para um evento:
"${texto}"

Retorne APENAS um array JSON válido, sem markdown, sem explicação, sem texto adicional.
Formato: [{"id": "item_id", "qtd": numero}]

Regras:
- Use apenas IDs que existem no catálogo acima
- Se quantidade for mencionada, use ela. Senão, use 1
- Interprete termos genéricos: "técnico" = tec_som, "iluminação completa" = vários itens de iluminação
- Inclua apenas itens relevantes ao pedido`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || "[]"
      const clean = text.replace(/```json|```/g, "").trim()
      const itens = JSON.parse(clean)
      const novasQtds = {}
      itens.forEach(({ id, qtd }) => {
        if (catalog.find(i => i.id === id)) novasQtds[id] = qtd
      })
      setQtds(p => ({ ...p, ...novasQtds }))
      setIaResultCount(itens.filter(({ id }) => catalog.find(i => i.id === id)).length)
    } catch (e) {
      console.error("Erro IA:", e)
    }
    setBuscandoIA(false)
  }

  async function gerar() {
    const sel = catalog.filter(i => (qtds[i.id] || 0) > 0)
    if (!form.cliente.trim()) { alert("Informe o nome do cliente."); return }
    if (!form.evento.trim()) { alert("Informe o evento."); return }
    if (sel.length === 0) { alert("Adicione ao menos um item."); return }
    const equip = sel.filter(i => i.cat !== "equipe")
    const equipe = sel.filter(i => i.cat === "equipe")
    const equipFull = equip.reduce((s, i) => s + calcFullPrice(i, qtds[i.id], getDias(i.id)), 0)
    const equipDesc = equip.reduce((s, i) => s + calcDesconto(i, qtds[i.id], getDias(i.id)), 0)
    const equipNet  = equipFull - equipDesc
    const equipeTotal = equipe.reduce((s, i) => s + calcItem(i, qtds[i.id], getDias(i.id)), 0)
    const subtotal = equipNet + equipeTotal
    const impV = form.imposto ? subtotal * 0.12 : 0
    const orc = {
      id: uid(), ...form,
      itens: sel.map(i => ({ id: i.id, nome: i.nome, cat: i.cat, qtd: qtds[i.id],
        dias: getDias(i.id), preco: i.preco, desc: i.desc, sub: i.sub,
        fullPrice: calcFullPrice(i, qtds[i.id], getDias(i.id)),
        desconto: calcDesconto(i, qtds[i.id], getDias(i.id)),
        total: calcItem(i, qtds[i.id], getDias(i.id)) })),
      equipFull, equipDesc, equipNet, equipeTotal,
      subtotal, impV, total: subtotal + impV,
      criado: new Date().toISOString()
    }
    let novo
    if (editingId) {
      novo = orcs.map(o => o.id === editingId ? { ...orc, id: editingId, status: o.status } : o)
    } else {
      novo = [orc, ...orcs]
    }
    try { localStorage.setItem("plateia_orcs", JSON.stringify(novo)) } catch {}
    setOrcs(novo)
    setModal(editingId ? novo.find(o => o.id === editingId) : orc)
    setQtds({})
    setItemDias({})
    setEditingId(null)
  }

  async function saveCat(c) {
    setCatalog(c)
    try { localStorage.setItem("plateia_cat", JSON.stringify(c)) } catch {}
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}`}</style>

      {modal && <ModalPdf orc={modal} onClose={() => setModal(null)} />}

      <div style={{ borderBottom: `1px solid ${BR}`, padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: P }} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
            Plateia <span style={{ color: P }}>Produções</span>
          </span>
          <span style={{ fontSize: 11, color: "#444", fontWeight: 400 }}>produções artísticas</span>
        </div>
        <span style={{ fontSize: 12, color: "#444" }}>{orcs.length} orçamento{orcs.length !== 1 ? "s" : ""} no histórico</span>
      </div>

      <div style={{ borderBottom: `1px solid ${BR}`, display: "flex", padding: "0 28px" }}>
        {[["novo", "Novo Orçamento"], ["historico", `Histórico (${orcs.length})`], ["catalogo", "Catálogo"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: "none", border: "none",
            borderBottom: tab === id ? `2px solid ${CY}` : "2px solid transparent",
            color: tab === id ? CY : "#555",
            padding: "14px 18px", fontSize: 13, fontWeight: tab === id ? 600 : 400,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: -1
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: 28, maxWidth: 1080, margin: "0 auto" }}>
        {tab === "novo" && (
          <TabNovo
            form={form} setForm={setForm}
            qtds={qtds} setQtds={setQtds}
            itemDias={itemDias} setItemDias={setItemDias}
            getDias={getDias}
            catF={catF} setCatF={setCatF}
            busca={busca} setBusca={setBusca}
            catalog={catalog} gerar={gerar}
            editingId={editingId} cancelEdit={cancelEdit}
            buscarItensIA={buscarItensIA} buscandoIA={buscandoIA} iaResultCount={iaResultCount} setIaResultCount={setIaResultCount}
          />
        )}
        {tab === "historico" && <TabHistorico orcs={orcs} onView={setModal} onEdit={startEdit} onStatus={updateStatus} />}
        {tab === "catalogo" && <TabCatalogo catalog={catalog} onSave={saveCat} />}
      </div>
    </div>
  )
}
