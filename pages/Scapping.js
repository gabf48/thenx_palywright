import { paginationLocators } from '../locators/pagination.locators.js';
import { homeLocators } from '../locators/home.locators.js';
import { productLocators } from '../locators/product.locators.js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export class Scraping {
    constructor(page) {
        this.page = page;
        this.productsData = [];
    }

    async extractProducts() {
        let pageIndex = 1;

        // for (;;) {
            const products = this.page.locator(homeLocators.productList);
            const count = await products.count();
            console.log(`On page ${pageIndex} there are ${count} products`);

            // for (let i = 0; i < count; i++) {
                for (let i = 0; i < 5; i++) {
                await products.nth(i).scrollIntoViewIfNeeded();
                await products.nth(i).click();

                // așteaptă pagina produsului
                await this.page.waitForSelector(
                    productLocators.productTitle,
                    { timeout: 15000 }
                );

                // TEXT
                const titleText = await this.safeText(
                    this.page.locator(productLocators.productTitle)
                );
                   
                
                const descriptionText =
                (await this.safeText(this.page.locator(productLocators.productDescription))) ||
                (await this.safeText(this.page.locator(productLocators.productDescription_2)));
                const rawPrice = await this.safeText(
                    this.page.locator(productLocators.productPrice)
                );

                const priceText = this.normalizePrice(rawPrice);

                // IMAGES
                let imagesText = '';
                try {
                    const imageLinksLocator = this.page.locator(productLocators.imageLinks);
                    const hrefs = await imageLinksLocator.evaluateAll(elements =>
                        elements
                            .map(el => el.getAttribute('href'))
                            .filter(Boolean)
                    );
                    imagesText = hrefs.join(', ');
                } catch {
                    console.warn('Images not found for product:', titleText);
                }

                // SAVE PRODUCT
                this.productsData.push({
                    Title: titleText,
                    Description: descriptionText,
                    Price: priceText,
                    Images: imagesText
                });

                await this.page.goBack();
                await this.page.waitForTimeout(500);
            }

        //     // NEXT PAGE
        //     const nextButton = this.page.locator(paginationLocators.nextPage);
        //     if (await nextButton.count() === 0) break;

        //     const classes = await nextButton.getAttribute('class');
        //     if (classes?.includes('pagination__arrow--disabled')) {
        //         console.log('Last page reached');
        //         break;
        //     }

        //     await nextButton.click();
        //     await this.page.waitForTimeout(500);
        //     pageIndex++;
        // }

        await this.saveToExcel();
    }

    // ================= HELPERS =================

    async safeText(locator) {
        try {
            if (await locator.count() === 0) return '';
            return (await locator.first().textContent())?.trim() || '';
        } catch {
            return '';
        }
    }

    normalizePrice(rawPrice) {
        if (!rawPrice) return '';

        return rawPrice
            .replace(/\s+/g, '')   // elimină spații
            .replace('RON', '')    // elimină moneda
            .replace(/\./g, '')    // elimină separatori de mii
            .replace(',', '.')     // , → .
            .trim();
    }

    async saveToExcel() {
        const worksheet = XLSX.utils.json_to_sheet(this.productsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        const resultsDir = path.join(process.cwd(), 'results');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir);
        }

        const filePath = path.join(resultsDir, 'products.xlsx');
        XLSX.writeFile(workbook, filePath);

        console.log('Products exported to:', filePath);
    }
}
