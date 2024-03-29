const targetPath = "cypress/data/ads/"

describe("Extract ads", () => {
  if (!Cypress.env("ADS_ENV")) {
    throw new Error("Please make sure to set CYPRESS_ADS_ENV")
  }

  ;["de", "fr", "it", "en"].forEach((language) => {
    const fileName = `master-${Cypress.env("ADS_ENV")}-${language}-v3.json`

    it(`${language.toUpperCase()}: Extract and store ad images in json file`, () => {
      cy.clearCookie("OptanonAlertBoxClosed")
      cy.clearCookie("eupubconsent-v2")

      cy.visit(`/${language}/?visitorId=ads-default&totmdebug=true`, {
        timeout: 20000,
        onBeforeLoad: ($window) => {
          return new Cypress.Promise((resolve) => {
            const onAdLoaded = () => {
              $window.document.removeEventListener(
                "adHpEmotionalLoaded",
                onAdLoaded
              )
              resolve()
            }
            $window.document.addEventListener(
              "adHpEmotionalLoaded",
              onAdLoaded,
              true
            )
          })
        },
      }).then(() => {
        cy.get("#onetrust-accept-btn-handler", { timeout: 10000 }).click()
        cy.get("#tatm-adHpEmotional")
        cy.get(".ad-loaded > #tatm-adHpEmotional[data-ad]", {
          timeout: 20000,
        }).then(($ad) => {
          const ad =
            $ad[0].dataset && $ad[0].dataset.ad
              ? JSON.parse($ad[0].dataset.ad)
              : {}
          cy.writeFile(`${targetPath}${fileName}`, ad)
        })
      })
    })
  })
})
