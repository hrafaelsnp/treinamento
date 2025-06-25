# Tabelas de Escalas - Vídeo e Áudio

Aplicação web que exibe duas tabelas (Vídeo e Áudio) com dados obtidos de planilhas do Google Sheets, atualizando a cada 5 segundos.

## Características

- **Duas abas**: Vídeo e Áudio, cada uma com sua própria tabela
- **Atualização automática**: Dados atualizados a cada 5 segundos
- **Agrupamento por colaborador**: Dados agrupados e ordenados alfabeticamente por colaborador
- **Cabeçalho fixo**: Cabeçalho da tabela permanece visível durante a rolagem
- **Design responsivo**: Funciona em dispositivos móveis e desktop
- **Tratamento de erros**: Sistema de cache e tratamento de falhas na conexão
- **Modo de desenvolvimento**: Dados de exemplo para testes sem conexão com Google Sheets

## Requisitos

- Acesso à internet para buscar dados das planilhas do Google Sheets
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web para hospedar os arquivos (ou executar localmente)

## Configuração

### 1. Configurar Google Sheets

As planilhas do Google Sheets devem estar configuradas com as seguintes características:

#### Planilha de Vídeo
- **ID da planilha**: `1S20g4jhNfoZ6ayvAJC5HNHi8KJs_JAWL_xxxCChGOog`
- **Nome da aba**: `escalaVideo`
- **Colunas necessárias**:
  - `colaborador`: Nome do colaborador
  - `Status`: Status do serviço
  - `horaPrevista`: Hora prevista
  - `local`: Local do serviço
  - `servicoVideo`: Serviço de vídeo
  - `observaçãoVideo`: Observações
  - `nomeEvento`: Nome do evento
  - `tipoEvento`: Tipo do evento

#### Planilha de Áudio
- **ID da planilha**: `1smzyrRUnPZkfZGY-8EPDGg7Js8_6-nQ2xlpXgl8Orjw`
- **Nome da aba**: `escalaAudio`
- **Colunas necessárias**:
  - `colaboradorAudio`: Nome do colaborador
  - `Status`: Status do serviço
  - `horaPrevista`: Hora prevista
  - `local`: Local do serviço
  - `servicoAudio`: Serviço de áudio
  - `observaçãoAudio`: Observações
  - `nomeEvento`: Nome do evento
  - `tipoEvento`: Tipo do evento

### 2. Configurar Chave de API do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Sheets
4. Crie uma chave de API
5. Substitua a chave de API no arquivo `js/config.js`

```javascript
// Em js/config.js
API_KEY: 'SUA_CHAVE_DE_API_AQUI',
```

### 3. Configurar IDs das Planilhas

Se necessário, atualize os IDs das planilhas no arquivo `js/config.js`:

```javascript
// Em js/config.js
SHEETS: {
    VIDEO: {
        ID: 'ID_DA_SUA_PLANILHA_DE_VIDEO',
        RANGE: 'escalaVideo!A:Z'
    },
    AUDIO: {
        ID: 'ID_DA_SUA_PLANILHA_DE_AUDIO',
        RANGE: 'escalaAudio!A:Z'
    }
},
```

## Instalação

1. Faça o download dos arquivos do projeto
2. Configure a chave de API e os IDs das planilhas conforme instruções acima
3. Hospede os arquivos em um servidor web ou execute localmente

### Executando Localmente

Para executar localmente usando Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Acesse `http://localhost:8000` no navegador.

### Modo de Desenvolvimento

Para testar a aplicação sem conexão com o Google Sheets, adicione o parâmetro `dev=true` à URL:

```
http://localhost:8000/?dev=true
```

Isso ativará o modo de desenvolvimento, que usa dados de exemplo em vez de buscar das planilhas.

## Estrutura do Projeto

```
tabelas-sheets/
├── index.html          # Estrutura HTML da aplicação
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   ├── config.js       # Configurações da aplicação
│   ├── api.js          # Integração com Google Sheets API
│   └── app.js          # Lógica principal da aplicação
└── README.md           # Documentação
```

## Personalização

### Alterando Cores

Para alterar as cores da aplicação, edite as variáveis CSS no arquivo `css/styles.css`:

```css
:root {
    --header-bg: #5F7171;        /* Cor do cabeçalho */
    --header-text: #ffffff;      /* Cor do texto do cabeçalho */
    --alternate-row: #bcbbbb;    /* Cor das linhas alternadas */
    /* ... outras variáveis ... */
}
```

### Alterando Intervalo de Atualização

Para alterar o intervalo de atualização, edite a configuração no arquivo `js/config.js`:

```javascript
// Intervalo de atualização em milissegundos (5 segundos)
UPDATE_INTERVAL: 5000,
```

## Solução de Problemas

### Erro "Não foi possível carregar dados"

- Verifique se a chave de API está correta
- Verifique se os IDs das planilhas estão corretos
- Verifique se as planilhas estão compartilhadas publicamente
- Verifique a conexão com a internet

### Dados não aparecem

- Verifique se as colunas nas planilhas correspondem às configuradas no arquivo `js/config.js`
- Verifique se há dados nas planilhas
- Tente usar o modo de desenvolvimento para verificar se a aplicação está funcionando corretamente

## Licença

Este projeto está licenciado sob a licença MIT.

