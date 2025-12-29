import { expect, Locator, Page } from 'playwright/test';
import Helpers from '../utilities/helpers/helpers';

export class CheckoutPage {
    Page: Page;
    private checkoutHeading: Locator;
    private firstNameTxtBox: Locator;
    private lastNameTxtBox: Locator;
    private emailTxtBox: Locator;
    private countryDropdown: Locator;
    private cityTxtBox: Locator;
    private address1TxtBox: Locator;
    private zipPostalCodeTxtBox: Locator;
    private phoneNumberTxtBox: Locator;
    private continueButton: Locator;
    private shippingAddressDropdown: Locator;
    private shippingMethodLabel: Locator;
    private paymentInfoLabel: Locator;
    private codPaymentMethodRadio: Locator;
    private paymentMethodText: Locator;
    private confirmButton: Locator;
    private orderTotalPrice: Locator;
    private thankYouHeading: Locator;
    private successMessage: Locator;
    private orderNumberText: Locator;


    constructor(Page: Page) {
        this.Page = Page;
        this.checkoutHeading = Page.getByRole('heading', { name: 'Checkout' });
        this.firstNameTxtBox = Page.getByRole('textbox', { name: 'First name:' });
        this.lastNameTxtBox = Page.getByRole('textbox', { name: 'Last name:' });
        this.emailTxtBox = Page.getByRole('textbox', { name: 'Email:' });
        this.countryDropdown = Page.getByLabel('Country:');
        this.cityTxtBox = Page.getByRole('textbox', { name: 'City:' });
        this.address1TxtBox = Page.getByRole('textbox', { name: 'Address 1:' });
        this.zipPostalCodeTxtBox = Page.getByRole('textbox', { name: 'Zip / postal code:' });
        this.phoneNumberTxtBox = Page.getByRole('textbox', { name: 'Phone number:' });
        this.continueButton = Page.getByRole('button', { name: 'Continue' });
        this.shippingAddressDropdown = Page.getByLabel('Select a shipping address');
        this.shippingMethodLabel = Page.getByText('Compared to other shipping');
        this.paymentInfoLabel = Page.locator('div[class="section payment-info"]');
        this.codPaymentMethodRadio = Page.getByRole('radio', { name: 'Cash On Delivery (COD) (7.00' });
        this.paymentMethodText = Page.locator('li[class="payment-method"]');
        this.confirmButton = Page.getByRole('button', { name: 'Confirm' });
        this.orderTotalPrice = Page.locator('span[class="product-price order-total"]');
        this.thankYouHeading = Page.getByRole('heading', { name: 'Thank you' });
        this.successMessage = Page.locator('.title');
        this.orderNumberText = Page.getByText('Order number:');

    }

    async fillBillingAddress(testData: any): Promise<void> {
        await this.checkoutHeading.waitFor({ state: 'visible' });
        await this.firstNameTxtBox.fill(testData.firstName);
        await this.lastNameTxtBox.fill(testData.lastName);
        await this.emailTxtBox.fill(testData.email);
        await this.countryDropdown.selectOption(testData.country);
        await this.cityTxtBox.fill(testData.city);
        await this.address1TxtBox.fill(testData.address1);
        await this.zipPostalCodeTxtBox.fill(testData.zipCode);
        await this.phoneNumberTxtBox.fill(testData.phoneNumber);
        await this.continueButton.click();
    }
    async shippingAddress(): Promise<void> {
        await this.shippingAddressDropdown.waitFor({ state: 'visible', timeout: 60000 });
        await this.continueButton.click();
    }
    async shippingMethod(): Promise<void> {
        await this.shippingMethodLabel.waitFor({ state: 'visible' });
        await this.continueButton.click();
    }
    async paymentMethod(): Promise<void> {
        await this.codPaymentMethodRadio.check();
        await this.continueButton.click();
    }
    async paymentInfo(): Promise<void> {
        await this.paymentInfoLabel.waitFor({ state: 'visible' });
        await this.continueButton.click();
    }
    async confirmOrder(totalPrice: any, testData: any): Promise<void> {
        let total = +totalPrice;
        if ((await this.paymentMethodText.textContent())?.includes("COD")) {

            total = +totalPrice + 7;
            await expect(await this.orderTotalPrice.textContent()).toContain(total.toString());
        } else {
            await expect(await this.orderTotalPrice.textContent()).toContain(total.toString());
        }
        console.log(`Final Total Price to be Paid: ${total}`);
        await this.confirmButton.click();
        await this.thankYouHeading.waitFor({ state: 'visible' });
        console.log(await this.successMessage.textContent());
        let orderNumber = (await this.orderNumberText.textContent())?.trim();
        console.log(orderNumber);

        testData.orderNumber = orderNumber;
        Helpers.writeJSON('tests/utilities/testData/products.json', testData);
    }

}