feat: aplica design system HorizonTec em toda a aplicação

- Adiciona tema light com paleta solar (fundo branco, accent laranja #FF8A00,
  azul horizonte #1E88E5) via @theme no index.css
- Fonte Inter para UI e Caveat (script) para o logo "Solaris"
- Cards padronizados: rounded-2xl, border-border-default, hover azul + shadow sutil
- Inputs unificados: rounded-md, bg-transparent, focus accent-primary
- Labels em text-xs uppercase tracking-wide em todos os formulários
- Botões primários com gradiente solar (linear-gradient #FFB200 → #FF8A00)
- Botões secondary em azul (accent-horizon) com borda sutil
- Botões "add" (adicionar experiência, formação, etc) em azul com hover brightness
- Ícones em text-muted com strokeWidth={1.5}

Páginas:
- HomePage: logo Caveat laranja, CTA gradiente, seção WhatsApp, cards de features
- CurriculumsPage: busca inline minimalista (sem card/divider), botão lupa,
  skeleton loading no grid, card clicável, hero reduzido
- CurriculumDetailsPage: tab bar reorganizada (←Voltar + tabs), loading com
  spinner + backdrop-blur, Tab extraído para fora do render (corrige warning)
- CurriculumDetails: nav interna removida, 5 seções com tokens, badges azuis
- Login/Register/PasswordForgot: cards com tokens, inputs e botões padronizados
- FormCurriculum/EditCurriculum: header com tokens, estado de erro atualizado

Componentes:
- ButtonActions: ícones apenas (Pencil/Trash2), sem labels
- CurriculumFileHistory: tokens, download btn gradiente, skeleton atualizado
- CurriculumCard (page): card encapsulado com hover, badge azul, removido botão
  "Ver currículo" (card inteiro agora é o Link)
- GenerateCurriculumCard: modal com tokens
- Loading: spinner com border-accent-horizon
- Footer: cores herdadas do tema

Correções:
- EducationForm: typo "Nenhum formação" → "Nenhuma formação"
- ProjectForm/CertificationForm: adicionados border-color e label-color faltantes
- LoginForm/RegisterForm: error alert corrigido de dark→light
- PasswordForgotPage: aplicado design system completo
