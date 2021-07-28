export interface Products {
    name:string,
    price:string,
    link:string,
    imageLink:string
}

export const searchInPage = async (page, options) => {

    return new Promise( async (resolve, reject) => {
        await page.focus(options.inputSearchWay)
        await page.keyboard.type(options.searchText)
        await page.keyboard.press("Enter")

        await page.on('load', async () => {
            
            var pageResult = await getResultFromPage(page, options)
            resolve(pageResult)
                
        })
    })
    
}

const getResultFromPage = async (page, options) => {
        
    
    const result = await page.evaluate((options) => {
        const products:Array<Products> = []
        document.querySelectorAll(options.productWay)
        .forEach((product) => {

            let name:string = ''
            let price:string = '0'
            let imageLink:string = ''
            let link:string = ''

            
            if(product.querySelectorAll(options.productNameWay)[0] !== undefined) 
                name = product.querySelectorAll(options.productNameWay)[0].innerText

            if(product.querySelectorAll(options.productLink)[0] !== undefined)
                link = product.querySelectorAll(options.productLink)[0].href

            if(product.querySelectorAll(options.productImageWay)[0] !== undefined) {

                imageLink = product.querySelectorAll(options.productImageWay)[0].src
                
                if(imageLink.indexOf('https') == -1)
                    imageLink = product.querySelectorAll(options.productImageWay)[0].getAttribute('data-src')
                    
                imageLink = imageLink.replace('webp', 'jpeg')
            }
    
            
            if(product.querySelectorAll(options.productPriceWay)[0] !== undefined)
                price = product.querySelectorAll(options.productPriceWay)[0].innerText

            price = `R$${price}`.replace('\n','')

            const productItem:Products = {
                name:name,
                price:price,
                link:link,
                imageLink:imageLink
            }

            if(price !== 'R$0')
                products.push(productItem)
        })
        
        return products
    }, options)

    return result
}   


