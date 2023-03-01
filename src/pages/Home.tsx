import { useContext, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader, 
  IonCardTitle,
  IonCardSubtitle,
  IonProgressBar
} from '@ionic/react';
import './Home.css';
import { AppContext, formatDate, setProgress, setTarget } from '../State';


const SetTarget: React.FC = () => {

  const { state, dispatch } = useContext(AppContext);
  
  const [localTarget, setLocalTarget] = useState(null);

  const saveTarget = (e: any) => {
    e.preventDefault();
    dispatch(setTarget(localTarget));
  }

  const onTargetInputChange = (e: any) => {
    setLocalTarget(e.target.value);
  }

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Set target in litre</IonCardTitle>
          <IonCardSubtitle>Enter daily target to achieve, no of litre water you want to drink daily.</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
              
          <IonList>
            <IonItem> 
              <IonInput inputmode="numeric" onIonChange={ (e: any) => onTargetInputChange(e) }  placeholder="e.g., 3"></IonInput>
            </IonItem>
            
            <IonButton onClick={saveTarget}>Save</IonButton>
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  )
}

const Home: React.FC = () => {
 
  const { state, dispatch } = useContext(AppContext);
    
  const showTargetForm = () => {
    dispatch(setTarget(null));
  }

  const setUpdate = (ml) => {
    
    const today = formatDate(new Date());

    let achieve = parseInt(state.achieve) + parseInt(ml); 

    if(today != state.date) {
      achieve = ml;
    }

    const progress = achieve * 100 / (state.target * 1000);

    dispatch(setProgress({
      progress: progress,
      achieve: achieve,
      date: today
    })); 
  }
  
  const ShowTarget = () => {
    return (
      <>
        <IonCard>
          <IonCardContent>
            <p>Your target is { state.target } litre.
            </p>  
            
            <IonButton size="small" onClick={ showTargetForm }>Change</IonButton>
          </IonCardContent>
          <IonCardHeader>
            <IonCardTitle>Progress { state.progress }%</IonCardTitle>
            
            <IonProgressBar value={state.progress / 100}></IonProgressBar>

            <IonButton fill='outline' onClick={ () => setUpdate(100) }>+100 ml</IonButton>
            <IonButton fill='outline' onClick={ () => setUpdate(200) }>+200 ml</IonButton>
            <IonButton fill='outline' onClick={ () => setUpdate(500) }>+500 ml</IonButton>
            <IonButton fill='outline' onClick={ () => setUpdate(1000) }>+1000 ml/ + 1 litre</IonButton>

          </IonCardHeader>
        </IonCard>  
      </>
    )
  }

  let targetDetail;
 
  if(state.target > 0) {
    targetDetail = <ShowTarget></ShowTarget>;
  } else {
    targetDetail = <SetTarget></SetTarget>;
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hydration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Hydration
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        { targetDetail }

      </IonContent>
    </IonPage>
  );
};

export default Home;
