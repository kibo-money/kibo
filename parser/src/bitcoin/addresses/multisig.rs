//
// Code from bitcoin-explorer now deprecated
//

use bitcoin::{
    blockdata::{
        opcodes::all,
        script::Instruction::{self, Op, PushBytes},
    },
    Opcode, Script,
};

///
/// Obtain addresses for multisig transactions.
///
pub fn multisig_addresses(script: &Script) -> Vec<Vec<u8>> {
    let ops: Vec<Instruction> = script.instructions().filter_map(|o| o.ok()).collect();

    // obtain number of keys
    let num_keys = {
        if let Some(Op(op)) = ops.get(ops.len() - 2) {
            decode_from_op_n(op)
        } else {
            unreachable!()
        }
    };

    // read public keys
    let mut public_keys = Vec::with_capacity(num_keys as usize);

    for op in ops.iter().skip(1).take(num_keys as usize) {
        if let PushBytes(data) = op {
            public_keys.push(data.as_bytes().to_vec());
        } else {
            unreachable!()
        }
    }

    public_keys
}

///
/// Decode OP_N
///
/// translated from BitcoinJ:
/// [decodeFromOpN()](https://github.com/bitcoinj/bitcoinj/blob/d3d5edbcbdb91b25de4df3b6ed6740d7e2329efc/core/src/main/java/org/bitcoinj/script/Script.java#L515:L524)
///
#[inline]
fn decode_from_op_n(op: &Opcode) -> i32 {
    if op.eq(&all::OP_PUSHBYTES_0) {
        0
    } else if op.eq(&all::OP_PUSHNUM_NEG1) {
        -1
    } else {
        op.to_u8() as i32 + 1 - all::OP_PUSHNUM_1.to_u8() as i32
    }
}
