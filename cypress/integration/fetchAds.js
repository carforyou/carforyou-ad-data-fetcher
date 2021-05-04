const targetPath = "cypress/data/ads/"

describe("Extract ads", () => {
  if (!Cypress.env("ADS_ENV")) {
    throw new Error("Please make sure to set CYPRESS_ADS_ENV")
  }

  ;["de"].forEach((language) => {
    const fileName = `master-${Cypress.env("ADS_ENV")}-${language}-v3.json`

    it(`${language.toUpperCase()}: Extract and store ad images in json file`, () => {
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
        cy.get('button[id="onetrust-accept-btn-handler"]').click()
        cy.reload(true)
        cy.get("#tatm-adHpEmotional")
        cy.get("#tatm-adHpEmotional[data-ad]", { timeout: 20000 }).then(
          ($ad) => {
            const ad =
              $ad[0].dataset && $ad[0].dataset.ad
                ? JSON.parse($ad[0].dataset.ad)
                : {}
            debugger
            cy.log("condition")
            cy.log(!!($ad[0].dataset && $ad[0].dataset.ad))
            cy.log("has node")
            cy.log(!!$ad[0])
            cy.log("has dataset")
            cy.log(!!$ad[0].dataset)
            cy.log("has dataset ad")
            cy.log(!!$ad[0].dataset.ad)
            cy.log("dataset")
            cy.log($ad[0].dataset.ad)
            cy.writeFile(`${targetPath}${fileName}`, ad)

            // Legacy suppport
            if (language === "de") {
              const fileNameV0 = "master.json"
              cy.writeFile(`${targetPath}${fileNameV0}`, {})
              const fileNameV1 = `master-${Cypress.env("ADS_ENV")}.json`
              cy.writeFile(`${targetPath}${fileNameV1}`, {})
              const fileNameV2 = `master-${Cypress.env("ADS_ENV")}-v2.json`
              cy.writeFile(`${targetPath}${fileNameV2}`, ad)
            }
          }
        )
      })
    })
  })
})
