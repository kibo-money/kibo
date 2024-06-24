# SATONOMICS

## Description

TLDR: Free, open source, verifiable and self-hostable Bitcoin on-chain data generator and visualizer

Satonomics is an open-source suite of tools that computes, distributes, and displays on-chain data, making it freely available for anyone to use.

The generated datasets are incredibly diverse and can be used for a wide range of purposes. Whether you're looking to conduct a health check on the network, gain insights into its current or past state, or leverage the data for trading purposes, these tools offer various charts, dashboards (Soon TM), and an extensive API to help you achieve your goals.

To promote transparency and trust in the network, this project is committed to making on-chain data accessible and verifiable to all, without discrimination and is a great complimentary tool to [mempool.space](https://mempool.space).

## Instances

Web App:
- [app.satonomics.xyz](https://app.satonomics.xyz)

API:
- [api.satonomics.xyz](https://api.satonomics.xyz)

## Structure

- `parser`: The backbone of the project, it does most of the work by parsing and then computing datasets from the timechain.
- `server`: A small server which automatically creates routes to access through an API all created datasets.
- `app`: A web app which displays the generated datasets in various charts.

## Git

- [Repository](https://codeberg.org/satonomics/satonomics)
- [Issues](https://gitworkshop.dev/r/naddr1qq99xct5dahx7mtfvdesz9thwden5te0wp6hyurvv4ex2mrp0yhxxmmdqgsfw5dacngjlahye34krvgz7u0yghhjgk7gxzl5ptm9v6n2y3sn03srqsqqqaueek2h03/issues)
- [Proposals](https://gitworkshop.dev/r/naddr1qq99xct5dahx7mtfvdesz9thwden5te0wp6hyurvv4ex2mrp0yhxxmmdqgsfw5dacngjlahye34krvgz7u0yghhjgk7gxzl5ptm9v6n2y3sn03srqsqqqaueek2h03/proposals)

## Goals

- Be the absolute best on-chain data source and app
- Have as many datasets and charts as possible
- Be self-hostable on cheap computers
  - Be runnable on a machine with 8 GB RAM (16 GB RAM is already possible right now)
- Still being runnable 10 years from now
  - By not relying on any third-party dependencies besides price APIs (which are and should be very common and easy to update)
  - By **NOT** doing address labelling/tagging (which means **NO** exchange or any other individual address tracking), for that please use [mempool.space](https://mempool.space) or any other tool

## Proof of Work

Aka: Previous iterations

The initial idea was totally different yet morphed over time into what it is today: a fully FOSS self-hostable on-chain data generator

- https://github.com/drgarlic/satonomics
- https://github.com/drgarlic/satonomics-parser
- https://github.com/drgarlic/satonomics-explorer
- https://github.com/drgarlic/satonomics-server
- https://github.com/drgarlic/satonomics-app
- https://github.com/drgarlic/bitalisys
- https://github.com/drgarlic/bitesque-app
- https://github.com/drgarlic/bitesque-back
- https://github.com/drgarlic/bitesque-front
- https://github.com/drgarlic/bitesque-assets
- https://github.com/drgarlic/syf
