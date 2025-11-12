// test/products.test.ts
import { prismaMock } from './setup';
import request from 'supertest';
import app from '../src/app';

describe('Products Controller', () => {
  describe('GET /products', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'Test Product',
          description: 'Mock description',
          price: 10,
          stock: 5,
          category: 'electronics',
          userId: 'user-1',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      prismaMock.product.count.mockResolvedValue(1);
      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/products?page=1&pageSize=10')
        .expect(200);

      expect(response.body.currentPage).toBe(1);
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe('Test Product');
    });

    it(' search products by name', async () => {
      const searchProducts = [
        {
          id: 'prod-2',
          name: 'Laptop',
          description: 'Gaming Laptop',
          price: 1500,
          stock: 3,
          category: 'electronics',
          userId: 'user-2',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      prismaMock.product.count.mockResolvedValue(1);
      prismaMock.product.findMany.mockResolvedValue(searchProducts);

      const response = await request(app)
        .get('/products?search=Laptop')
        .expect(200);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: {
              contains: 'Laptop',
              mode: 'insensitive'
            }
          }
        })
      );
      expect(response.body.products[0].name).toBe('Laptop');
    });
  });
});
