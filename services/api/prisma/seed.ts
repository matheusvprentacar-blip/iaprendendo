import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const skillCards: Prisma.SkillCardCreateInput[] = [
  {
    skill_id: 'MAT.EF01.001',
    bncc_code: 'EF01MA01',
    area: 'Matemática',
    grade_year: '1º ano EF',
    objective: 'A criança deve utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações do cotidiano',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '3 passos', suporte_visual: true, pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'MAT.EF01.002',
    bncc_code: 'EF01MA02',
    area: 'Matemática',
    grade_year: '1º ano EF',
    objective: 'A criança deve contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '2 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'MAT.EF01.003',
    bncc_code: 'EF01MA03',
    area: 'Matemática',
    grade_year: '1º ano EF',
    objective: 'A criança deve estimar e comparar quantidades de objetos de dois conjuntos para indicar "tem mais", "tem menos" ou "tem a mesma quantidade"',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '3 passos', suporte_visual: true, pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'MAT.EF01.004',
    bncc_code: 'EF01MA04',
    area: 'Matemática',
    grade_year: '1º ano EF',
    objective: 'A criança deve contar a quantidade de objetos de coleções até 100 unidades e indicar a quantidade por meio de registros',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '4 passos', suporte_visual: true, pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'MAT.EF01.005',
    bncc_code: 'EF01MA05',
    area: 'Matemática',
    grade_year: '1º ano EF',
    objective: 'A criança deve comparar números naturais de até duas ordens em situações cotidianas, com e sem suporte da reta numérica',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '2 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'LP.EF01.001',
    bncc_code: 'EF01LP01',
    area: 'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective: 'A criança deve reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '2 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'LP.EF01.002',
    bncc_code: 'EF01LP02',
    area: 'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective: 'A criança deve perceber que palavras diferentes compartilham certas letras',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '3 passos', suporte_visual: true, pistas_opcionais: true, reducao_itens_tela: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'LP.EF01.003',
    bncc_code: 'EF01LP03',
    area: 'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective: 'A criança deve segmentar oralmente palavras em sílabas com ou sem apoio de gestos rítmicos corporais',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '2 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'LP.EF01.004',
    bncc_code: 'EF01LP04',
    area: 'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective: 'A criança deve identificar o número de sílabas de palavras com 2 e 3 sílabas',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '3 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
  {
    skill_id: 'LP.EF01.005',
    bncc_code: 'EF01LP05',
    area: 'Língua Portuguesa',
    grade_year: '1º ano EF',
    objective: 'A criança deve reconhecer que palavras diferentes têm comprimentos diferentes e que o comprimento da palavra não corresponde ao comprimento do objeto que ela nomeia',
    support_matrix: {
      neutro: { linguagem: 'padrao', segmentacao: 'tarefa completa', suporte_visual: false, duracao_max_s: 420 },
      leve: { linguagem: 'simplificada', segmentacao: '2 passos', suporte_visual: true, pistas_opcionais: true, duracao_max_s: 300 },
      intensivo: { linguagem: 'explicita_gradual', segmentacao: 'micro_passos_30s', suporte_visual: true, suporte_auditivo: true, duracao_max_s: 180, modelo_instrucao: 'gradual_release' },
    } as Prisma.JsonObject,
  },
];

async function main(): Promise<void> {
  console.error('Seeding 10 BNCC EF 1º ano Skill Cards...');

  for (const card of skillCards) {
    await prisma.skillCard.upsert({
      where: { skill_id: card.skill_id as string },
      update: {},
      create: card,
    });
  }

  console.error(`✓ ${skillCards.length} Skill Cards seeded successfully.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
