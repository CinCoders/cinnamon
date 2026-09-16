import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@/lib-components/Text/Text";

const meta: Meta<typeof Text> = {
  title: "Lib Components/Text",
  component: Text,
  args: {
    children: "Módulo de Exemplo (Tarefas)",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "title",
        "subtitle",
        "description",
        "announce",
        "tag",
        "alarm",
        "headline",
        "alert",
        "murmur",
        "emphasis",
        "whisper",
        "faint",
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Variantes nomeadas pela **voz** que o texto assume no contexto de uso, não pela classe Tailwind que carregam. Use o nome para decidir onde aplicar: quem *anuncia* algo (`announce`), quem *rotula* um campo (`tag`), quem *soa alarme* (`alarm`), e assim por diante.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Title: Story = {
  args: { variant: "title" },
};

export const Subtitle: Story = {
  args: { variant: "subtitle", children: "Subtítulo de exemplo" },
};

export const Description: Story = {
  args: {
    variant: "description",
    children:
      "Esta página exemplifica o padrão de listagem via hook + service, formulário modal, e controle de acesso (RBAC).",
  },
};

export const Announce: Story = {
  args: { variant: "announce", children: "Editar Tarefa" },
  parameters: {
    docs: {
      description: {
        story:
          "Uso: título de modal/dialog (ex.: `MemberModal`, `TodoModal`). Renderiza como `<h2>`.",
      },
    },
  },
};

export const Tag: Story = {
  args: { variant: "tag", children: "Nome" },
  parameters: {
    docs: {
      description: {
        story:
          "Uso: rótulo de campo de formulário. Renderiza como `<label>` — combine com `htmlFor` no `<input>` associado.",
      },
    },
  },
};

export const Alarm: Story = {
  args: { variant: "alarm", children: "Este campo é obrigatório." },
  parameters: {
    docs: {
      description: {
        story: "Uso: mensagem de erro de validação inline, logo abaixo de um campo.",
      },
    },
  },
};

export const Headline: Story = {
  args: { variant: "headline", children: "Tarefas do time" },
  parameters: {
    docs: {
      description: {
        story: "Uso: título de card ou seção dentro de uma página. Renderiza como `<h3>`.",
      },
    },
  },
};

export const Alert: Story = {
  args: { variant: "alert", children: "Algo deu errado" },
  parameters: {
    docs: {
      description: {
        story:
          "Uso: título de tela de erro (ex.: `ErrorBoundary`). Um degrau abaixo de `title`, acima de `announce`.",
      },
    },
  },
};

export const Murmur: Story = {
  args: {
    variant: "murmur",
    children:
      "Um erro inesperado ocorreu. Tente recarregar a página ou volte mais tarde.",
  },
  parameters: {
    docs: {
      description: {
        story: "Uso: corpo explicativo abaixo de um título `alert`, com largura limitada (`max-w-md`).",
      },
    },
  },
};

export const Emphasis: Story = {
  args: { variant: "emphasis", children: "Informação para o Desenvolvedor:" },
  parameters: {
    docs: {
      description: {
        story: "Uso: ênfase em negrito dentro de texto corrido, sem cor própria — herda a cor do contexto.",
      },
    },
  },
};

export const Whisper: Story = {
  args: {
    variant: "whisper",
    children: "Esta mensagem só aparece em ambiente de desenvolvimento.",
  },
  parameters: {
    docs: {
      description: {
        story: "Uso: texto pequeno dentro de um callout/info box (ex.: caixa azul informativa).",
      },
    },
  },
};

export const Faint: Story = {
  args: { variant: "faint", children: "Sem responsável" },
  parameters: {
    docs: {
      description: {
        story: "Uso: texto secundário de baixo contraste, como metadados em badges e listas.",
      },
    },
  },
};
