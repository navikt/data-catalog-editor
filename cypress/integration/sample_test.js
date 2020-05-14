describe('My First Test', ()=>{
  it('Does not do much',()=>{
    cy.visit('http://localhost:3000/')
    cy.get('[href="/process"] > .b7 > .b0').click()
    cy.url().should('include','/process')
    cy.get('.cb > .d7')
      .type('test')

  })
})
