// Creates a user or changes a password. There is no sign-up screen.
//   npm run user:create
//   npm run user:password
import "../server/env.js";
import { createInterface } from "node:readline/promises";
import { eq } from "drizzle-orm";
import { hashPassword } from "../server/auth/password.js";
import { db } from "../server/db/client.js";
import { sessions, users } from "../server/db/schema.js";

const MIN_PASSWORD = 8;

const rl = createInterface({ input: process.stdin, output: process.stdout });

async function ask(question: string): Promise<string> {
  return (await rl.question(question)).trim();
}

// Hides typed characters by swallowing readline's echo while the question is open.
async function askHidden(question: string): Promise<string> {
  const output = rl as unknown as { _writeToOutput: (s: string) => void };
  const original = output._writeToOutput;
  output._writeToOutput = (s) => {
    if (s.startsWith(question)) original.call(rl, question);
  };
  try {
    return await rl.question(question);
  } finally {
    output._writeToOutput = original;
    process.stdout.write("\n");
  }
}

async function askPassword(): Promise<string> {
  for (;;) {
    const password = await askHidden(`Senha (mín. ${MIN_PASSWORD} caracteres): `);
    if (password.length < MIN_PASSWORD) {
      console.log("Senha muito curta.");
      continue;
    }
    if ((await askHidden("Confirme a senha: ")) === password) return password;
    console.log("As senhas não conferem.");
  }
}

async function create() {
  const name = await ask("Nome: ");
  const email = (await ask("E-mail: ")).toLowerCase();
  if (!name || !email.includes("@")) throw new Error("Nome e e-mail são obrigatórios.");
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) throw new Error("Já existe um usuário com esse e-mail.");
  const passwordHash = await hashPassword(await askPassword());
  await db.insert(users).values({ name, email, passwordHash });
  console.log(`Usuário ${email} criado.`);
}

async function changePassword() {
  const email = (await ask("E-mail: ")).toLowerCase();
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (!user) throw new Error("Usuário não encontrado.");
  const passwordHash = await hashPassword(await askPassword());
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
  await db.delete(sessions).where(eq(sessions.userId, user.id));
  console.log("Senha alterada; as sessões abertas foram encerradas.");
}

const command = process.argv[2];
try {
  if (command === "create") await create();
  else if (command === "password") await changePassword();
  else throw new Error("Uso: tsx scripts/user.ts <create|password>");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  rl.close();
}
