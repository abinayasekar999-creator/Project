import { test } from 'playwright/test';
import { LandingPage } from '../pageObjects/landingPage';
import Helpers from '../utilities/helpers/helpers';
import { CheckoutPage } from '../pageObjects/checkoutPage';

test.setTimeout(80000);
test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.navigateToWebShop();
});

test('Add Item to Cart Tests', async ({ page }) => {
    const testData = Helpers.readJSON('tests/utilities/testData/products.json');
    const checkoutData = Helpers.readJSON('tests/utilities/testData/checkoutDetails.json');
    const landingPage = new LandingPage(page);
    const checkoutPage = new CheckoutPage(page);
    const products: string[] = testData.products;
    for (const product of products) {
        await landingPage.addItemToCart(product);
    }
    await landingPage.gotoCart();
    let totatPrice = await landingPage.priceCalculation();      //price calculation
    await landingPage.checkout();
    await checkoutPage.fillBillingAddress(checkoutData.billingDetails);
    await checkoutPage.shippingAddress();
    await checkoutPage.shippingMethod();
    await checkoutPage.paymentMethod();
    await checkoutPage.paymentInfo();
    await checkoutPage.confirmOrder(totatPrice, testData);      //place order

});