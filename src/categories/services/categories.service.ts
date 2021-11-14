import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateCategoryDto} from '../dto/create-category.dto';
import {UpdateCategoryDto} from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import {CategoryNotFoundException} from '../exceptions/category-not-found.exception';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    getAllCategories(): Promise<Category[]> {
        return this.categoriesRepository.find({ relations: ['posts'] });
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOne(id, {
            relations: ['posts']
        });
        if (category) {
            return category;
        }
        throw new CategoryNotFoundException(id);
    }

    async createCategory(category: CreateCategoryDto) {
        const newCategory = this.categoriesRepository.create(category);
        await this.categoriesRepository.save(newCategory);
        return newCategory;
    }

    async updateCategory(id: number, category: UpdateCategoryDto): Promise<Category> {
        await this.categoriesRepository.update(id, category);
        const updatedCategory = await this.categoriesRepository.findOne(id, { relations: ['posts'] });

        if (updatedCategory) {
            return updatedCategory;
        }
        throw new CategoryNotFoundException(id);
    }

    async deleteCategory(id: number): Promise<void> {
        const deleteResponse = await this.categoriesRepository.softDelete(id);

        if (!deleteResponse.affected) {
            throw new CategoryNotFoundException(id);
        }
    }
}
