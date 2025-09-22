import React, { useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Avatar, 
    Grid, 
    LinearProgress, 
    Button, 
    Modal, 
    Chip,
    Divider 
} from '@mui/material';
import { Container } from './styles';
import { avatarDataType } from '../../../../types';

type CharactersProps = {
    characters: avatarDataType[];
}

const Characters: React.FC<CharactersProps> = ({ characters }) => {
    const [selectedCharacter, setSelectedCharacter] = useState<avatarDataType | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleViewMore = (character: avatarDataType) => {
        setSelectedCharacter(character);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCharacter(null);
    };

    const getProgressColor = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 75) return 'success';
        if (percentage >= 50) return 'warning';
        if (percentage >= 25) return 'error';
        return 'error';
    };

    const getProgressValue = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                Personagens da Campanha
            </Typography>
            
            {characters.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Nenhum personagem encontrado nesta campanha.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                {characters.map((character) => (
                    <Grid item xs={12} md={6} lg={4} key={character.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar 
                                        src={character.data.img} 
                                        alt={character.data.name}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {character.data.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {character.data.class.title ?? ''} • Nível {character.data.level}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Vida */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            Vida
                                        </Typography>
                                        <Typography variant="body2">
                                            {character.data.basics.life.actual}/{character.data.basics.life.max}
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={getProgressValue(character.data.basics.life.actual, character.data.basics.life.max)}
                                        color={getProgressColor(character.data.basics.life.actual, character.data.basics.life.max)}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>

                                {/* Sanidade */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            Sanidade
                                        </Typography>
                                        <Typography variant="body2">
                                            {character.data.basics.sanity.actual}/{character.data.basics.sanity.max}
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={getProgressValue(character.data.basics.sanity.actual, character.data.basics.sanity.max)}
                                        color={getProgressColor(character.data.basics.sanity.actual, character.data.basics.sanity.max)}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>

                                {/* PE */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            PE
                                        </Typography>
                                        <Typography variant="body2">
                                            {character.data.basics.pe.actual}/{character.data.basics.pe.max}
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={getProgressValue(character.data.basics.pe.actual, character.data.basics.pe.max)}
                                        color={getProgressColor(character.data.basics.pe.actual, character.data.basics.pe.max)}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>

                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth
                                    onClick={() => handleViewMore(character)}
                                >
                                    Ver Mais
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                </Grid>
            )}

            {/* Modal de detalhes */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    width: '90%',
                    maxWidth: 800,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}>
                    {selectedCharacter && (
                        <>
                            {/* Cabeçalho */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar 
                                    src={selectedCharacter.data.img} 
                                    alt={selectedCharacter.data.name}
                                    sx={{ width: 80, height: 80, mr: 3 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="h2" gutterBottom>
                                        {selectedCharacter.data.name}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        {selectedCharacter.data.class.title ?? ''} • Nível {selectedCharacter.data.level}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {selectedCharacter.data.gender} • {selectedCharacter.data.age} anos
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Informações básicas em grid */}
                            <Grid container spacing={3}>
                                {/* Status */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>Status</Typography>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">Vida</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data.basics.life.actual}/{selectedCharacter.data.basics.life.max}
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={getProgressValue(selectedCharacter.data.basics.life.actual, selectedCharacter.data.basics.life.max)}
                                            color={getProgressColor(selectedCharacter.data.basics.life.actual, selectedCharacter.data.basics.life.max)}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">Sanidade</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data.basics.sanity.actual}/{selectedCharacter.data.basics.sanity.max}
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={getProgressValue(selectedCharacter.data.basics.sanity.actual, selectedCharacter.data.basics.sanity.max)}
                                            color={getProgressColor(selectedCharacter.data.basics.sanity.actual, selectedCharacter.data.basics.sanity.max)}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">PE</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data.basics.pe.actual}/{selectedCharacter.data.basics.pe.max}
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={getProgressValue(selectedCharacter.data.basics.pe.actual, selectedCharacter.data.basics.pe.max)}
                                            color={getProgressColor(selectedCharacter.data.basics.pe.actual, selectedCharacter.data.basics.pe.max)}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1">Ciberpsicosy</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data.basics.cyberpsicosy.actual}/{selectedCharacter.data.basics.cyberpsicosy.max}
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={getProgressValue(selectedCharacter.data.basics.cyberpsicosy.actual, selectedCharacter.data.basics.cyberpsicosy.max)}
                                            color={getProgressColor(selectedCharacter.data.basics.cyberpsicosy.actual, selectedCharacter.data.basics.cyberpsicosy.max)}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Atributos */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>Atributos</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {selectedCharacter.data.AGI}
                                                </Typography>
                                                <Typography variant="body2">AGI</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {selectedCharacter.data.FOR}
                                                </Typography>
                                                <Typography variant="body2">FOR</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {selectedCharacter.data.INT}
                                                </Typography>
                                                <Typography variant="body2">INT</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {selectedCharacter.data.PRE}
                                                </Typography>
                                                <Typography variant="body2">PRE</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ textAlign: 'center', p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {selectedCharacter.data.VIG}
                                                </Typography>
                                                <Typography variant="body2">VIG</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Informações gerais */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Informações Gerais</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Dinheiro</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                ${selectedCharacter.data.money}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Defesa</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data.defense.normal}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" color="text.secondary">Subclasse</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {selectedCharacter.data?.subclass?.title ?? 'Sem subclasse'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Lore */}
                                {selectedCharacter.data.lore && (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>História</Typography>
                                        <Typography variant="body1" sx={{ 
                                            backgroundColor: 'grey.50', 
                                            p: 2, 
                                            borderRadius: 1,
                                            fontStyle: 'italic' 
                                        }}>
                                            {selectedCharacter.data.lore}
                                        </Typography>
                                    </Grid>
                                )}

                                {/* Perícias */}
                                {selectedCharacter.data.skill.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>Perícias</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {selectedCharacter.data.skill.map((skill, index) => (
                                                <Chip 
                                                    key={index} 
                                                    label={`${skill.perk} (${skill.expertise})`} 
                                                    color="primary" 
                                                    variant="outlined" 
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button variant="contained" onClick={handleCloseModal}>
                                    Fechar
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default Characters;