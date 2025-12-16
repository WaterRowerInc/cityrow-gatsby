# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5] - 2024-07-10
- Remove Klarna
- Remove Klarna placements

## [2.4] - 2023-08-03
- Add wood type + monitor selector
- Redirect back on certain pages when login
- Add upgrade kit as Klarna item
- Remove unbounce code
- Fix: Avoid call disabled cross sell items
- Change commit author to deploy on vercel

## [2.3] - 2023-06-29
- Auto add promo codes to cart if product brings one
- Add custom cta for subscription PDPs

## [2.2] - 2023-04-10

- Update Product details, make title, price editable to override ecommerce fetch
- Update checkout copy
- Add new attribute for managing products which needs a subscription on checkout
- Add popup / logic to remove dependen item if it needs a subscription on checkout and subscription is removed from cart
- Show subscription price on cart (placeholder, not charging on ecommerce)
- Add wood color selector on PDP
- Hide pricing on product options wood selector
- Change parcel shipping copy (estimate time)
- Sync carousel image and selected variant
- Hide subscription items from purchase confirmation details
- Remove subscription price disclaimer from order summary
- Add product discounts and subscription discounts
- Add new display total property to mock subscription + items price total
- Check with stripe subscription discounts to get total to discount (subscription discount field)

## [2.1] - 2020-05-12

### Added

- Zheiner Updates
- Adapted the web for the in-app create account
- Title component (Zehner updates)
- Error Validation on credit card input (remove issued payment method on change)
- Error Validation on promo code input on checkout
- Promo code description on checkout page
- Loader when verifying promo code on checkout page
- Added Update Email on Cart when a user blurs the email input
- Form builder component for creating dynamic forms
- Added check if the card fails on the payment intent
- Delay field / func for newsletter builder component
- Added a library to check the accessibility on our site
- User email analytics tracking before email submit on newsletter component
- Product page, new TrustPilot Reviews section for rowers
- Added strikethrough price for the subscription's sale in the subscription modal
- Applied coupons for sale when a subscription is added to cart
- Facebook mobile app configuration to the website
- CTA on Carousel review
- Sticky CTA on PDP for mobile devices
- Unbounce script integration for Marketing custom popups
- Added user converted analytics event
- Added a check when a user inputs a promo code when buying a subscription, checking that both has the same plan
- Added a check when a cart is retrieved from swell and has a coupon, try to apply the coupon again in order to verify compatibility
- Allow subscription coupons that doesn't exist on swell to be added

### Changed

- Fixed External Mobile Nav Bar Links
- Rename New Product Comparison to Product Comparison
- Changed builder hardcoded prices for swell prices
- Rename Full Image Carousel to Carousel Full Image
- Rename Core products to Carousel Site Pages
- Rename Member Story Carousel to Carousel Image Description
- RollBack Information component changes (before zehner updates)
- Changed the segment initialize fixing an issue on the reset event.
- Fix flickering ribbon
- Fix checkout subscription charge when paying with Klarna
- Fix Footer, update graphql query to retrieve footer options
- Fix Footer, change display styles
- Fix Footer, change user status indicator (login / logout button)
- Encapsulate all dropdown styles into dropdown component
- Listen to user changes on checkout in order to show create account form if there's a subscription on the cart and the user logs out
- Product page, product carousel, focus active thumbnail
- Fixed errors on checkout related to payment options
- Fixed rounding problem
- Fixed Footer Links
- Fixed text inputs overlapping top navbar
- Fixed event not being fired in conversion segment event
- Fixed a couple of issues in the subscription page
- Fixed an async problem with some segment events at creat order
- Fixed an error on Klarna checkout when applying promo discount
- Change copy on subscription modal
- Remove address form when purchasing subscription
- Update Gatsby from version 2 to version 4
- Update Gatsby plugin dependencies to match new core version
- Changed YouTube Player loading script from helmet to built-in Gatsby Head
- Update the way we check for subscription coupons (name => stripe_id)
- Update message displayed on promo code box
- Fixed issue on PDP when selecting a subscription with only 1 plan

### Removed

- Old Product Comparison
- react-youtube Library
- react-lines-ellipsis Library
- react-headroom Library
- @types/react-headroom Library
- gatsby-source-contentful Library
- gatsby-plugin-i18n Library
- CTA & Custom Button from builder
- Image only component from project
- Carousel Image component from project
- Double Carousel component from project
- Old Hero component from project
- React Helmet Library
- Gatsby helmet plugin

## [2.0] - 2020-03-02

### Added

- New website!

### Changed

- Old Website

### Deprecated

- Old Website
