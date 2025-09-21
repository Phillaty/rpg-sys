# Solução para Problema com Query OR no Firestore

## Problema Original
```tsx
// ❌ PROBLEMÁTICO - Query OR com limitações
const q = query(
    collection(db, 'hability'),
    or(
        where('classId', '==', charcater?.data?.class?.id),
        where('__name__', 'in', charcater?.data?.hability)
    )
);
```

## Problemas com Query OR no Firestore

### 1. **Índices Compostos Necessários**
- O Firestore exige índices compostos específicos para queries OR
- Nem sempre é possível criar todos os índices necessários
- Pode gerar erros em tempo de execução

### 2. **Limitações com Arrays Vazios**
- Se `charcater?.data?.hability` for um array vazio, a query falha
- Problemas com valores undefined/null nas condições

### 3. **Performance**
- Queries OR podem ser menos eficientes que queries separadas
- Maior consumo de recursos do Firestore

## ✅ Solução Implementada: Queries Separadas

```tsx
useEffect(() => {
    if(charcater && charcater?.data?.class?.id) {
        const allHabilities = new Map<string, habilityDataType>();
        let completedQueries = 0;
        const totalQueries = 2;

        const updateHabilities = () => {
            completedQueries++;
            if (completedQueries === totalQueries) {
                const habilitiesData = Array.from(allHabilities.values());
                setHabilities(habilitiesData);
            }
        };

        // Query 1: Habilidades por classe
        const qClass = query(
            collection(db, 'hability'),
            where('classId', '==', charcater.data.class.id)
        );

        const unsubscribeClass = onSnapshot(qClass, (querySnapshot) => {
            querySnapshot.docs.forEach(doc => {
                allHabilities.set(doc.id, {
                    id: doc.id,
                    data: doc.data(),
                } as habilityDataType);
            });
            updateHabilities();
        });

        // Query 2: Habilidades específicas do personagem
        let unsubscribeChar: (() => void) | undefined;
        if (charcater.data.hability && charcater.data.hability.length > 0) {
            const qChar = query(
                collection(db, 'hability'),
                where('__name__', 'in', charcater.data.hability)
            );

            unsubscribeChar = onSnapshot(qChar, (querySnapshot) => {
                querySnapshot.docs.forEach(doc => {
                    allHabilities.set(doc.id, {
                        id: doc.id,
                        data: doc.data(),
                    } as habilityDataType);
                });
                updateAbilities();
            });
        } else {
            updateAbilities();
        }

        return () => {
            unsubscribeClass();
            if (unsubscribeChar) unsubscribeChar();
        };
    }
}, [charcater, campain]);
```

## Vantagens da Solução

### 1. **Robustez**
- ✅ Funciona mesmo com arrays vazios
- ✅ Não depende de índices compostos complexos
- ✅ Tratamento adequado de casos edge

### 2. **Performance**
- ✅ Queries mais simples e eficientes
- ✅ Uso otimizado de Map para evitar duplicatas
- ✅ Cleanup adequado dos listeners

### 3. **Flexibilidade**
- ✅ Fácil de estender para mais condições
- ✅ Melhor controle sobre quando executar cada query
- ✅ Tratamento individualizado de erros

## 🚀 Versão Otimizada com Custom Hook

Para reutilização e melhor organização, criamos o hook `useCharacterAbilities`:

```tsx
// Hook personalizado
const { abilities, loading, error } = useCharacterAbilities({
    classId: character?.data?.class?.id,
    characterAbilities: character?.data?.hability || [],
    enabled: Boolean(character?.data?.class?.id)
});
```

### Benefícios do Hook:
- **Reutilizável** em múltiplos componentes
- **Memoização** automática para performance
- **Estados** de loading e error incluídos
- **Cleanup** automático dos listeners
- **Tipagem** TypeScript completa

## Padrões Recomendados

### ✅ Fazer
```tsx
// Usar queries separadas para OR complexos
// Validar arrays antes de usar 'in'
// Usar Map para evitar duplicatas
// Implementar cleanup adequado
// Memoizar dependências
```

### ❌ Evitar
```tsx
// OR queries sem índices adequados
// Queries com arrays potencialmente vazios
// Listeners sem cleanup
// Re-execuções desnecessárias
```

Esta solução resolve completamente o problema original e oferece melhor performance e manutenibilidade.