use std::{
    iter::Sum,
    ops::{Add, AddAssign, Div, Mul, Sub, SubAssign},
};

use itertools::Itertools;
use ordered_float::{FloatCore, OrderedFloat};

use super::ToF32;

pub trait ArrayOperations<T> {
    fn transform<F>(&self, transform: F) -> Vec<T>
    where
        T: Copy + Default,
        F: Fn((usize, &T, &[T])) -> T;

    fn add(&self, other: &[T]) -> Vec<T>
    where
        T: Add<Output = T> + Copy + Default;

    fn subtract(&self, other: &[T]) -> Vec<T>
    where
        T: Sub<Output = T> + Copy + Default;

    fn multiply(&self, other: &[T]) -> Vec<T>
    where
        T: Mul<Output = T> + Copy + Default;

    fn divide(&self, other: &[T]) -> Vec<T>
    where
        T: Div<Output = T> + Copy + Default;

    fn match_size<'a>(&'a self, other: &'a [T]) -> &'a [T];

    fn cumulate(&self) -> Vec<T>
    where
        T: Sum + Copy + Default + AddAssign;

    fn last_x_sum(&self, x: usize) -> Vec<T>
    where
        T: Sum + Copy + Default + AddAssign + SubAssign;

    fn moving_average(&self, x: usize) -> Vec<f32>
    where
        T: Sum + Copy + Default + AddAssign + SubAssign + ToF32;

    fn net_change(&self, offset: usize) -> Vec<T>
    where
        T: Copy + Default + Sub<Output = T>;

    fn median(&self, size: usize) -> Vec<Option<T>>
    where
        T: FloatCore;
}

impl<T> ArrayOperations<T> for &[T] {
    fn transform<F>(&self, transform: F) -> Vec<T>
    where
        T: Copy + Default,
        F: Fn((usize, &T, &[T])) -> T,
    {
        self.iter()
            .enumerate()
            .map(|(index, value)| transform((index, value, self)))
            .collect_vec()
    }

    fn add(&self, other: &[T]) -> Vec<T>
    where
        T: Add<Output = T> + Copy + Default,
    {
        self.match_size(other)
            .transform(|(index, value, _)| *value + *other.get(index).unwrap())
    }

    fn subtract(&self, other: &[T]) -> Vec<T>
    where
        T: Sub<Output = T> + Copy + Default,
    {
        self.match_size(other)
            .transform(|(index, value, _)| *value - *other.get(index).unwrap())
    }

    fn multiply(&self, other: &[T]) -> Vec<T>
    where
        T: Mul<Output = T> + Copy + Default,
    {
        self.match_size(other)
            .transform(|(index, value, _)| *value * *other.get(index).unwrap())
    }

    fn divide(&self, other: &[T]) -> Vec<T>
    where
        T: Div<Output = T> + Copy + Default,
    {
        self.match_size(other)
            .transform(|(index, value, _)| *value / *other.get(index).unwrap())
    }

    fn match_size(&self, other: &[T]) -> &[T] {
        let len = other.len();
        if self.len() > len {
            &self[..len]
        } else {
            self
        }
    }

    fn cumulate(&self) -> Vec<T>
    where
        T: Sum + Copy + Default + AddAssign,
    {
        let mut sum = T::default();

        self.iter()
            .map(|value| {
                sum += *value;
                sum
            })
            .collect_vec()
    }

    fn last_x_sum(&self, x: usize) -> Vec<T>
    where
        T: Sum + Copy + Default + AddAssign + SubAssign,
    {
        let mut sum = T::default();

        self.iter()
            .enumerate()
            .map(|(index, value)| {
                sum += *value;

                if index >= x - 1 {
                    let previous_index = index + 1 - x;

                    sum -= *self.get(previous_index).unwrap()
                }

                sum
            })
            .collect_vec()
    }

    fn moving_average(&self, x: usize) -> Vec<f32>
    where
        T: Sum + Copy + Default + AddAssign + SubAssign + ToF32,
    {
        let mut sum = T::default();

        self.iter()
            .enumerate()
            .map(|(index, value)| {
                sum += *value;

                if index >= x - 1 {
                    sum -= *self.get(index + 1 - x).unwrap()
                }

                sum.to_f32() / x as f32
            })
            .collect_vec()
    }

    fn net_change(&self, offset: usize) -> Vec<T>
    where
        T: Copy + Default + Sub<Output = T>,
    {
        self.transform(|(index, value, arr)| {
            let previous = {
                if let Some(previous_index) = index.checked_sub(offset) {
                    *arr.get(previous_index).unwrap()
                } else {
                    T::default()
                }
            };

            *value - previous
        })
    }

    fn median(&self, size: usize) -> Vec<Option<T>>
    where
        T: FloatCore,
    {
        let even = size % 2 == 0;
        let median_index = size / 2;

        if size < 3 {
            panic!("Computing a median for a size lower than 3 is useless");
        }

        self.iter()
            .enumerate()
            .map(|(index, _)| {
                if index >= size - 1 {
                    let mut arr = self[index - (size - 1)..index + 1]
                        .iter()
                        .map(|value| OrderedFloat(*value))
                        .collect_vec();

                    arr.sort_unstable();

                    if even {
                        Some(
                            (**arr.get(median_index).unwrap()
                                + **arr.get(median_index - 1).unwrap())
                                / T::from(2.0).unwrap(),
                        )
                    } else {
                        Some(**arr.get(median_index).unwrap())
                    }
                } else {
                    None
                }
            })
            .collect()
    }
}
