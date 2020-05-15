describe('Sidebar links', ()=>{
  it('Behandlinger link should redirect us to process page',()=>{
    cy.visit('http://localhost:3000/')
    cy.get('[href="/process"] > .b7 > .b0').click()
    cy.url().should('include','/process')

  })
})

describe('Test main search', ()=>{
  it('Number of test results should be more than 0',()=>{
    cy.get('.cb > .d7')
      .type('test')
    cy.get('#bui-1').contains('Alderspensjon').click()
  })
})
