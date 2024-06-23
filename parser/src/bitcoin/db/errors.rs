use std::convert::{self, From};
use std::error;
use std::fmt;
use std::io;
use std::string;
use std::sync;

pub type OpResult<T> = Result<T, OpError>;

#[derive(Debug)]
/// Custom error type
pub struct OpError {
    pub kind: OpErrorKind,
    pub message: String,
}

impl OpError {
    pub fn new(kind: OpErrorKind) -> Self {
        OpError {
            kind,
            message: String::new(),
        }
    }

    /// Joins the Error with a new message and returns it
    pub fn join_msg(mut self, msg: &str) -> Self {
        self.message.push_str(msg);
        OpError {
            kind: self.kind,
            message: self.message,
        }
    }
}

impl fmt::Display for OpError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        if self.message.is_empty() {
            write!(f, "{}", &self.kind)
        } else {
            write!(f, "{} {}", &self.message, &self.kind)
        }
    }
}

impl error::Error for OpError {
    fn description(&self) -> &str {
        self.message.as_ref()
    }
    fn cause(&self) -> Option<&dyn error::Error> {
        self.kind.source()
    }
}

#[derive(Debug)]
pub enum OpErrorKind {
    None,
    IoError(io::Error),
    Utf8Error(string::FromUtf8Error),
    RuntimeError,
    PoisonError,
    SendError,
}

impl fmt::Display for OpErrorKind {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            OpErrorKind::IoError(ref err) => write!(f, "I/O Error: {}", err),
            OpErrorKind::Utf8Error(ref err) => write!(f, "Utf8 Conversion: {}", err),
            ref err @ OpErrorKind::PoisonError => write!(f, "Threading Error: {}", err),
            ref err @ OpErrorKind::SendError => write!(f, "Sync: {}", err),
            ref err @ OpErrorKind::RuntimeError => write!(f, "RuntimeError: {}", err),
            OpErrorKind::None => write!(f, ""),
        }
    }
}

impl error::Error for OpErrorKind {
    fn source(&self) -> Option<&(dyn error::Error + 'static)> {
        match *self {
            OpErrorKind::IoError(ref err) => Some(err),
            OpErrorKind::Utf8Error(ref err) => Some(err),
            ref err @ OpErrorKind::PoisonError => Some(err),
            ref err @ OpErrorKind::SendError => Some(err),
            _ => None,
        }
    }
}

impl From<io::Error> for OpError {
    fn from(err: io::Error) -> Self {
        Self::new(OpErrorKind::IoError(err))
    }
}

impl From<bitcoin::consensus::encode::Error> for OpError {
    fn from(_: bitcoin::consensus::encode::Error) -> Self {
        Self::from("block decode error")
    }
}

impl convert::From<i32> for OpError {
    fn from(err_code: i32) -> Self {
        Self::from(io::Error::from_raw_os_error(err_code))
    }
}

impl convert::From<&str> for OpError {
    fn from(err: &str) -> Self {
        Self::new(OpErrorKind::None).join_msg(err)
    }
}

impl<T> convert::From<sync::PoisonError<T>> for OpError {
    fn from(_: sync::PoisonError<T>) -> Self {
        Self::new(OpErrorKind::PoisonError)
    }
}

impl<T> convert::From<sync::mpsc::SendError<T>> for OpError {
    fn from(_: sync::mpsc::SendError<T>) -> Self {
        Self::new(OpErrorKind::SendError)
    }
}

impl convert::From<string::FromUtf8Error> for OpError {
    fn from(err: string::FromUtf8Error) -> Self {
        Self::new(OpErrorKind::Utf8Error(err))
    }
}

impl convert::From<leveldb::error::Error> for OpError {
    fn from(err: leveldb::error::Error) -> Self {
        Self::from(err.to_string().as_ref())
    }
}
