import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";
import { Keypair, Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction} from "@solana/web3.js";
import {
  deserialize,
  serialize,
  field,
} from "@dao-xyz/borsh";
import * as bs from "bs58"
import { use } from "chai";


// class IxnData
// {
//   @field({type: 'u64'})
//   discriminator: bigint

//   @field({type: 'string'})
//   username: string

//   constructor(data: IxnData)
//   {
//       Object.assign(this, data)
//   }
// }

// // Program and Wallet Setup
// const programId = new PublicKey("9WRa3Dpz2Di4awYBmdvUwh9gawrQLi29exR8RctkEMhj");
// const con = new Connection("http://localhost:8899");
// const payer = Keypair.fromSecretKey(new Uint8Array([60,47,24,41,124,38,29,174,148,9,75,149,213,111,119,71,15,176,180,5,2,166,29,48,17,117,165,158,65,113,58,87,174,62,177,215,55,175,64,51,59,214,219,41,188,114,34,240,162,219,28,151,218,1,55,207,57,167,11,32,9,226,96,165]));

// // Tx Instruction data to be encoded
const username = "egor.sol"
// const discriminator = 17121445590508351407n

// // Serialization Data
// const value = new IxnData({discriminator: discriminator, username: username});
// const serialized = serialize(value);
// const data = bs.default.encode(serialized);

// // Getting PDA
// const [PDA] = PublicKey.findProgramAddressSync(
//   [
//     Buffer.from("polyanka_dao_program"),
//     Buffer.from(username)
//   ],
//   programId
// )
// console.log(data)

// const instruction = new TransactionInstruction({
//   keys: [
//     {
//       pubkey: payer.publicKey,
//       isSigner: true,
//       isWritable: true,
//     },
//     {
//       pubkey: PDA,
//       isSigner: false,
//       isWritable: false
//     },
//     {
//       pubkey: new PublicKey("6y1Fh4cFHrzASYsQZmxsXZSfxJL1ecSmsDJAn2kw1Fht"),
//       isSigner: false,
//       isWritable: true
//     },
//     {
//       pubkey: SystemProgram.programId,
//       isSigner: false,
//       isWritable: false
//     }
//   ],
//   data: data,
//   programId
// })

// let transaction = new Transaction().add(instruction)

// const signature = sendAndConfirmTransaction(
//   con,
//   transaction,
//   [payer]
// )

// console.log(signature)

describe("my-program", () => {
  const provider =  anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MyProgram as Program<MyProgram>;
  const wallet = provider.wallet as anchor.Wallet;

  // it("Is initialized!", async () => {
  //   const [PDA] = await PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("polyanka_dao_program"),
  //       Buffer.from(username)
  //     ],
  //     program.programId
  //   )
  //   const tx = await program.methods.initialize(username)
  //   .accounts({
  //     storage: PDA, 
  //     payer: wallet.publicKey,
  //     receiver: "6y1Fh4cFHrzASYsQZmxsXZSfxJL1ecSmsDJAn2kw1Fht"
  //   })
  //   .rpc();

  //   console.log("Your transaction signature", tx);

  //   const data = await program.account.userInfo.fetch(PDA);
  //   console.log(data.endDate.toString());
  //   console.log(data);
  // });

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
