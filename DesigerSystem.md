### 1. Princípios de Design Adaptados
*   **Respiro (White Space):** O branco do fundo não é vazio, é o "céu" onde o conteúdo respira. O layout deve ser arejado.
*   **Aquecimento Sutil:** A IA e as ações principais usam o gradiente solar (amarelo/laranja) para atrair o olhar, enquanto o azul mantém a confiança e a estrutura.
*   **Curvas Orgânicas:** Inspirado no semicírculo e no sol, os componentes usam bordas mais arredondadas, quebrando a rigidez do código.

---

### 2. Paleta de Cores (Inspirada na HorizonTec)

**Cores Base (Background & Surfaces):**
*   `BG-Base`: `#FFFFFF` (Branco puro, o fundo principal)
*   `BG-Surface`: `#F8F9FA` (Cinza-gelo quase imperceptível, para separar seções ou cartões)
*   `BG-Elevated`: `#FFFFFF` (Cartões elevados usam branco com bordas sutis em vez de sombras pesadas)

**Cores de Texto:**
*   `Text-Primary`: `#0F172A` (Azul-marinho profundo, quase preto, garantindo contraste máximo no branco)
*   `Text-Secondary`: `#475569` (Cinza ardósia para subtítulos)
*   `Text-Muted`: `#94A3B8` (Cinza claro para placeholders e detalhes)

**Cores de Marca (Sol e Horizonte):**
*   `Accent-Sun` (Primário/CTA): `#FF8A00` (Laranja vibrante do sol) -> *Usado para o gradiente.*
*   `Accent-Sun-Light`: `#FFB200` (Amarelo solar)
*   `Accent-Horizon` (Estrutura/Links): `#1E88E5` (O azul do semicírculo, para links secundários ou ícones)

**Bordas e Divisores:**
*   `Border-Default`: `#E2E8F0` (Cinza muito claro para delinear cartões e inputs)
*   `Border-Focus`: `#FF8A00` (O laranja do sol aparece ao focar em um campo)

---

### 3. Tipografia
A imagem usa uma fonte manuscrita (script). Em UI minimalista, fontes manuscritas são ilegíveis para textos longos. A solução é usá-las apenas para o **Logo ou Títulos Decorativos**, e uma fonte limpa para a interface.

*   **Família UI Principal:** `Inter` ou `Plus Jakarta Sans` (Moderna, geométrica e limpa).
*   **Família Destaque (Brand):** `Caveat` ou `Pacifico` (Para o logo "HorizonTec" ou pequenos detalhes manuscritos na UI, dando o toque humano da imagem).
*   **Família Mono:** `Fira Code` (Para blocos de código).

**Escala Tipográfica:**
*   Display (H1): `56px` / Weight: `700` / Cor: `Text-Primary`
*   Heading (H2): `36px` / Weight: `600`
*   Title (H3): `24px` / Weight: `600`
*   Body Large: `18px` / Weight: `400` / Cor: `Text-Secondary`
*   Body Default: `15px` / Weight: `400`
*   Caption: `12px` / Weight: `500` (UPPERCASE)

---

### 4. Componentes Minimalistas (Light Theme)

#### A. Botões
Sem sombras. O botão principal usa o calor do sol.

*   **Primary (CTA "Solar"):**
    *   Background: `linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)` (O gradiente do sol)
    *   Text: `#FFFFFF` (Branco)
    *   Padding: `12px 28px`
    *   Border-radius: `8px` (Levemente arredondado)
    *   Hover: Aumenta levemente a saturação ou escurece o gradiente.
*   **Secondary (Horizon):**
    *   Background: Transparent
    *   Text: `Accent-Horizon` (Azul)
    *   Border: `1px solid #E2E8F0`
    *   Hover: Background fica `#F8F9FA`.

#### B. Inputs (Campos de Prompt/Busca)
Linhas limpas, foco no aquecimento solar.

*   **Default:** Background `#FFFFFF`, Border `1px solid Border-Default`, Texto `Text-Primary`.
*   **Focus:** A borda muda para `Accent-Sun` (`#FF8A00`), sem o *outline* azul padrão de navegadores, mantendo a estética limpa.

#### C. Cartões (Cards de Recursos/Agentes)
Minimalismo puro no branco.

*   Background: `#FFFFFF`
*   Border: `1px solid #E2E8F0`
*   Border-radius: `16px` (Arredondado, remetendo ao formato do sol e do semicírculo)
*   Hover: A borda muda para `Accent-Horizon` (Azul) ou aparece uma sombra extremamente suave (`box-shadow: 0 4px 20px rgba(0,0,0,0.05)`).
*   Ícones dentro do card: Podem usar o gradiente solar para dar vida ao card branco.

#### D. Terminal / Code Block
Contraste elegante.

*   Background: `#0F172A` (O azul-marinho profundo, invertendo o tema)
*   Text: `#F8F9FA`
*   Font: `Fira Code`, `14px`
*   Border-radius: `12px`

---

### 5. Iconografia
*   **Estilo:** *Outline* ou *Duotone*. Linhas de 1.5px a 2px.
*   **Tamanho:** `24px`.
*   **Cores:** Usa-se o `Accent-Horizon` (Azul) para ícones informativos e o gradiente `Accent-Sun` para ícones de ação ou IA.
*   **Forma:** Ícones com cantos levemente arredondados para combinar com a tipografia e os componentes.

---

### 6. Animação e Movimento
Como o tema é claro e arejado, as animações devem ser suaves como o nascer do sol.

*   **Duração:** `200ms` a `300ms`.
*   **Easing:** `ease-out` (começa rápido e desacelera suavemente).
*   **Efeitos:** Transições de cor (hover), e *fades* suaves de opacidade. Ao rolar a página, elementos podem surgir de baixo para cima com um leve aumento de opacidade.

---

### Resumo da Aplicação Visual
A tela abre com um fundo branco puro e imenso. O título principal em azul-marinho profundo é claro e direto. Um detalhe manuscrito azul pode aparecer como um subtítulo ou no logo no canto superior esquerdo, trazendo a personalidade da HorizonTec. 

O botão de chamada para ação (CTA) brilha no centro da tela com um gradiente laranja-amarelado, lembrando o sol, convidando o usuário a interagir com a IA. As seções abaixo são delimitadas por cartões brancos com bordas cinzas quase invisíveis, onde ícones azuis e laranjas guiam o usuário pelas funcionalidades de forma silenciosa, tecnológica e limpa.