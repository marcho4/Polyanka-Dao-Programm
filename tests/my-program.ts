import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";
import { Keypair, PublicKey} from "@solana/web3.js"
import bs58 from 'bs58';

describe("my-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider =  anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MyProgram as Program<MyProgram>;

  let username = "huy";
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
    console.log(data.endDate.toString());
    console.log(data);
  });
});
