use anchor_lang::prelude::*;
use anchor_lang::system_program;
use solana_program::pubkey;

extern crate chrono;
use chrono::prelude::*;

declare_id!("9WRa3Dpz2Di4awYBmdvUwh9gawrQLi29exR8RctkEMhj");

// Wallet, that will receive payments
const HARDCODED_PUBKEY: Pubkey = pubkey!("6y1Fh4cFHrzASYsQZmxsXZSfxJL1ecSmsDJAn2kw1Fht");

// Price of the subscription
const RENEWAL: u64 = 150000000; 

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, username: String) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.bump = ctx.bumps.storage;
        storage.tg_username = username;

        let naive: NaiveDateTime;
        let datetime: DateTime<Utc>;
        let newdate: chrono::format::DelayedFormat<chrono::format::StrftimeItems>;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info().clone(),
                to: ctx.accounts.receiver.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, RENEWAL)?;
        
        if storage.end_date != 0 {
            storage.end_date += 2629743;
        } else {
            storage.end_date = Clock::get()?.unix_timestamp + 2629743;
        }
        naive = NaiveDateTime::from_timestamp(storage.end_date, 0);
        datetime = DateTime::from_utc(naive, Utc);
        newdate = datetime.format("%Y-%m-%d %H:%M:%S");

        msg!("Your subscription is active before {}", newdate);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed,
        seeds = ["polyanka_dao_program".as_bytes(), username.as_bytes()],
        bump,
        space = 1 + 8 + 4 + 32 + 8,
        payer = payer,
    )]
    pub storage: Account<'info, UserInfo>,

    /// CHECK: Here you should put public key of community boss
    #[account(mut, address = HARDCODED_PUBKEY)]
    pub receiver: UncheckedAccount<'info>,
   
    pub system_program: Program<'info, System>,
}

// Struct for every user's PDA account
#[account]
pub struct UserInfo {
    pub end_date: i64, // 8
    pub tg_username: String, // 4 + 32
    pub bump: u8, // 1
}

#[account]
pub struct Receiver {}