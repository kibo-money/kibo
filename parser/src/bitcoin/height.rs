use super::NUMBER_OF_UNSAFE_BLOCKS;

pub fn check_if_height_safe(height: usize, block_count: usize) -> bool {
    height < block_count - NUMBER_OF_UNSAFE_BLOCKS
}
