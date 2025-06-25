# Instruções de Uso - Tabelas de Escalas

## Visão Geral

Esta aplicação exibe duas tabelas (Vídeo e Áudio) com dados obtidos de planilhas do Google Sheets, atualizando automaticamente a cada 5 segundos. Os dados são agrupados por colaborador e ordenados alfabeticamente.

## Como Usar

### Navegação entre Abas

- Clique na aba "Vídeo" para visualizar a tabela de escalas de vídeo
- Clique na aba "Áudio" para visualizar a tabela de escalas de áudio

### Interpretação dos Dados

- **Cabeçalho cinza escuro**: Contém os títulos das colunas
- **Linhas cinza claro**: Cabeçalho de grupo com o nome do colaborador
- **Linhas alternadas**: Dados das escalas, com cores alternadas para facilitar a leitura
- **Status coloridos**: 
  - Verde: Status "Normal"
  - Amarelo: Status "Aguardando Ficha"
  - Vermelho: Status "Cancelado"

### Atualização dos Dados

- Os dados são atualizados automaticamente a cada 5 segundos
- O horário da última atualização é exibido no canto superior direito
- Em caso de erro na conexão, uma mensagem será exibida e a aplicação tentará novamente

## Configuração das Planilhas

### Planilha de Vídeo

A planilha de vídeo deve conter as seguintes colunas:

| Coluna | Descrição |
|--------|-----------|
| colaborador | Nome do colaborador |
| Status | Status do serviço (Normal, Aguardando Ficha, etc.) |
| horaPrevista | Hora prevista para o serviço (formato HH:MM) |
| local | Local do serviço |
| servicoVideo | Tipo de serviço de vídeo |
| observaçãoVideo | Observações sobre o serviço |
| nomeEvento | Nome do evento |
| tipoEvento | Tipo do evento |

### Planilha de Áudio

A planilha de áudio deve conter as seguintes colunas:

| Coluna | Descrição |
|--------|-----------|
| colaboradorAudio | Nome do colaborador |
| Status | Status do serviço (Normal, Aguardando Ficha, etc.) |
| horaPrevista | Hora prevista para o serviço (formato HH:MM) |
| local | Local do serviço |
| servicoAudio | Tipo de serviço de áudio |
| observaçãoAudio | Observações sobre o serviço |
| nomeEvento | Nome do evento |
| tipoEvento | Tipo do evento |

## Requisitos Técnicos

- **Navegador**: Chrome, Firefox, Safari ou Edge atualizado
- **Conexão**: Acesso à internet para buscar dados das planilhas
- **Permissões**: As planilhas devem estar configuradas para acesso público ou com permissões adequadas

## Solução de Problemas Comuns

### Dados não aparecem

- Verifique se as planilhas estão acessíveis
- Verifique se a estrutura das planilhas corresponde ao esperado
- Tente acessar a aplicação com o parâmetro `?dev=true` para ver dados de exemplo

### Erro de conexão

- Verifique sua conexão com a internet
- Verifique se a chave de API do Google está configurada corretamente
- Verifique se os IDs das planilhas estão corretos

### Dados desatualizados

- A aplicação atualiza automaticamente a cada 5 segundos
- Se os dados parecerem desatualizados, verifique se as planilhas foram atualizadas
- Tente recarregar a página para forçar uma atualização completa

## Contato e Suporte

Para suporte técnico ou dúvidas sobre a aplicação, entre em contato com o administrador do sistema.

