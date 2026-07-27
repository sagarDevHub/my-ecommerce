import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../../../packages/product-db/src';
import { prisma } from '../../../../packages/product-db/src/client';
import { invalidateProductCache, invalidateProductListCache } from '../lib/cache';
import { redis } from '../lib/redis';

const CACHE_TTL = 3600;

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: Prisma.ProductCreateInput = req.body;

    const { colors, images } = data;
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({ message: `Colors array is missing!` });
    }

    if (!images || typeof images !== 'object') {
      return res.status(400).json({ message: `Image array is missing!` });
    }

    const missingColors = colors.filter(color => !(color in images));
    if (missingColors.length > 0) {
      return res.status(400).json({ message: `Missing images for colors: ${missingColors}` });
    }

    const product = await prisma.product.create({ data });
    await invalidateProductListCache();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: Prisma.ProductCreateInput = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    await invalidateProductCache(Number(id));
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });
    await invalidateProductCache(Number(id));
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort, category, search, limit } = req.query;

    const cacheKey = `products:${category || 'all'}:${search || 'none'}:${limit || 'all'}`;

    const cachedProducts = await redis.get(cacheKey);
    if (cachedProducts) {
      return res.status(200).json(cachedProducts);
    }

    const orderBy = (() => {
      switch (sort) {
        case 'asc':
          return { price: Prisma.SortOrder.asc };
        case 'desc':
          return { price: Prisma.SortOrder.desc };
        case 'oldest':
          return { createdAt: Prisma.SortOrder.asc };
        default:
          return { createdAt: Prisma.SortOrder.desc };
      }
    })();
    const products = await prisma.product.findMany({
      where: {
        category: category
          ? {
              slug: category as string,
            }
          : undefined,
        name: search
          ? {
              contains: search as string,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy,
      take: limit ? Number(limit) : undefined,
    });
    await redis.set(cacheKey, products, { ex: CACHE_TTL });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cachedProduct = await redis.get(cacheKey);
    if (cachedProduct) {
      return res.status(200).json({ product: cachedProduct });
    }
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ message: `Product not found` });
    await redis.set(cacheKey, product, { ex: CACHE_TTL });
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
