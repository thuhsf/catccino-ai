# Docker Scripts

Esse projeto possui alguns scripts auxiliares para facilitar o uso do Docker Compose durante o desenvolvimento.

---

# ⚠️ Aviso

Alguns scripts fazem uma limpeza pesada no Docker.

Dependendo do script executado, ele pode remover:

- Containers
- Images
- Volumes
- Networks
- Cache de build

Isso significa que:

- bancos locais podem ser apagados
- imagens precisarão ser baixadas novamente
- o próximo build pode ficar bem mais lento
- dependências podem ser reinstaladas do zero

Então use com atenção.

---

# Scripts disponíveis

## `clean-docker.sh`

Faz uma limpeza completa do Docker local.

Remove:

- todos os containers
- todas as images
- todos os volumes
- networks não utilizadas
- cache de build

### Uso

```bash
chmod +x clean-docker.sh
./clean-docker.sh
```

### Quando usar

Esse script é útil quando:

- o Docker começa a consumir muito espaço
- algum cache quebra o ambiente
- você quer resetar tudo completamente

---

## `start-clean-full.sh`

Faz um rebuild completo do projeto antes de subir os containers.

Esse script:

- derruba os containers atuais
- remove images e volumes do compose
- executa build com `--no-cache`
- sobe os containers novamente
- pergunta se deseja usar `-d`

### Uso

```bash
chmod +x start-clean-full.sh
./start-clean-full.sh
```

### Observação

Como ele remove volumes e images do projeto, alguns serviços podem precisar baixar/reinstalar coisas novamente.

---

## `start-clean.sh`

Script recomendado para o dia a dia.

Esse script:

- derruba containers antigos
- remove containers órfãos/parados
- executa build com `--no-cache`
- mantém images úteis já baixadas
- sobe os containers novamente
- pergunta se deseja iniciar em `-d`

### Uso

```bash
chmod +x start-clean.sh
./start-clean.sh
```

### Por que usar esse?

Porque ele mantém o ambiente limpo sem destruir todo o cache do Docker.

Na prática:

- builds continuam relativamente rápidos
- evita downloads desnecessários
- mantém imagens base já existentes
- funciona melhor para desenvolvimento contínuo

---

# Recomendação

## Uso diário

```bash
./start-clean.sh
```

---

## Rebuild completo do projeto

```bash
./start-clean-full.sh
```

---

## Reset total do Docker

```bash
./clean-docker.sh
```
