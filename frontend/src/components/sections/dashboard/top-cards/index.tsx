import Grid from '@mui/material/Grid';
import TopCard from './TopCard';
import { topCardsData } from 'data/topCardsData';

const TopCards = () => {
  return (
    <Grid container spacing={3.75}>
      {topCardsData.map((item) => (
        <Grid item key={item.id} xs={12} sm={12} lg={12}>
          <TopCard/>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
