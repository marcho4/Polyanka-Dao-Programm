import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";
import { PublicKey } from "@solana/web3.js";

// Tx Instruction data to be encoded
const username = "mark.sol"

describe("my-program", () => {
  const provider =  anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MyProgram as Program<MyProgram>;
  const wallet = provider.wallet as anchor.Wallet;

  it("Is initialized!", async () => {
    const [PDA] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("polyanka_dao_program"),
        Buffer.from(username)
      ],
      program.programId
    )
    const tx = await program.methods.initialize(username)
    .accounts({
      storage: PDA, 
      payer: wallet.publicKey,
      receiver: "6y1Fh4cFHrzASYsQZmxsXZSfxJL1ecSmsDJAn2kw1Fht"
    })
    .rpc();

    console.log("Your transaction signature", tx);

    const data = await program.account.userInfo.fetch(PDA);
    const unixtime = data.endDate.toNumber();
    let d = new Date(unixtime * 1000);
    console.log(d.toDateString());
  });

  it("Updated", async () => {
    const [PDA] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("polyanka_dao_program"),
        Buffer.from(username)
      ],
      program.programId
    )
    const tx = await program.methods.update(username)
    .accounts({
      storage: PDA, 
      payer: wallet.publicKey,
      receiver: "6y1Fh4cFHrzASYsQZmxsXZSfxJL1ecSmsDJAn2kw1Fht"
    })
    .rpc();

    console.log("Your transaction signature", tx);

    const data = await program.account.userInfo.fetch(PDA);
    const unixtime = data.endDate.toNumber();
    let d = new Date(unixtime * 1000);
    console.log(d.toDateString());
  });
});
