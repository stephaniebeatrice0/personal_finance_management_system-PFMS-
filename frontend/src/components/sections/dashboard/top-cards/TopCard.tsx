import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { TopCard as TopCardDataProps } from 'data/topCardsData';

// interface TopCardProps {
//   data: TopCardDataProps;
// }

const TopCard = () => {
  return (
   <Grid
      container
      width={1}
      padding={10}
      margin={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Grid xs={12} md={12}>
        <Grid item container maxWidth={'sm'} justifyContent="left">
          {' '}
          Good morning "Username"
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TopCard;
