# Solução para Warning: React does not recognize prop on DOM element

## Problema Resolvido
```
Warning: React does not recognize the `isToCloseSheet` prop on a DOM element. 
If you intentionally want it to appear in the DOM as a custom attribute, 
spell it as lowercase `istoclosesheet` instead. 
If you accidentally passed it from a parent component, remove it from the DOM element.
```

## Causa do Problema
O warning acontecia porque o styled-components estava passando a prop `isToCloseSheet` diretamente para o elemento DOM `<div>`. Por padrão, o styled-components repassa todas as props para o elemento HTML subjacente, mas o React não reconhece props customizadas em elementos DOM nativos.

## ❌ Código Problemático
```tsx
// styles.ts - ANTES
export const Container = styled.div<{isToCloseSheet: boolean}>`
    // ... estilos
    ${({ isToCloseSheet }) => css`
        animation: 0.5s ${isToCloseSheet ? fadeOut : fadeIn} forwards;
    `}
`

// index.tsx
<Container isToCloseSheet={isToCloseSheet}>
    {/* conteúdo */}
</Container>
```

## ✅ Solução Implementada
```tsx
// styles.ts - DEPOIS
export const Container = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isToCloseSheet',
})<{isToCloseSheet: boolean}>`
    // ... estilos
    ${({ isToCloseSheet }) => css`
        animation: 0.5s ${isToCloseSheet ? fadeOut : fadeIn} forwards;
    `}
`
```

## Como Funciona a Solução

### `withConfig({ shouldForwardProp })`
- **Filtra props** antes de passá-las para o DOM
- **Retorna `false`** para props que NÃO devem ser enviadas ao DOM
- **Retorna `true`** para props HTML válidas (como `className`, `onClick`, etc.)

### Resultado
- ✅ A prop `isToCloseSheet` é usada apenas nos estilos
- ✅ Não é passada para o elemento DOM `<div>`
- ✅ Warning eliminado
- ✅ Funcionalidade mantida

## Padrões Recomendados

### ✅ Para Props Customizadas em Styled Components
```tsx
export const StyledComponent = styled.div.withConfig({
    shouldForwardProp: (prop) => !['customProp1', 'customProp2'].includes(prop),
})<{ customProp1: boolean; customProp2: string }>`
    // estilos usando as props customizadas
`;
```

### ✅ Alternativa com Prefix
```tsx
// Usar $ prefix para props que são apenas para styling
export const StyledComponent = styled.div<{ $isActive: boolean }>`
    ${({ $isActive }) => css`
        opacity: ${$isActive ? 1 : 0.5};
    `}
`;

// Uso
<StyledComponent $isActive={true} />
```

### ✅ Para Props Múltiplas
```tsx
const customProps = ['isOpen', 'variant', 'size'];

export const StyledComponent = styled.div.withConfig({
    shouldForwardProp: (prop) => !customProps.includes(prop),
})<ComponentProps>`
    // estilos
`;
```

## Quando Usar Cada Abordagem

| Abordagem | Quando Usar |
|-----------|-------------|
| `shouldForwardProp` | Props que precisam de nomes claros no TypeScript |
| `$prefix` | Props simples, apenas para styling |
| Filtragem manual | Muitas props customizadas |

## Warnings Similares a Verificar

- Props boolean customizadas (`isOpen`, `isActive`, etc.)
- Props de configuração (`variant`, `size`, `theme`)
- Props de estado (`loading`, `disabled`, `selected`)
- Props de animação (`isAnimating`, `direction`)

Essa correção elimina completamente o warning e segue as melhores práticas do styled-components!