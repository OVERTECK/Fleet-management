namespace Backend.DataAccess.Entities;

public class TripEntity
{
    public Guid Id { get; set; }

    public CarEntity Car { get; set; }
    
    public string CarId { get; set; }

    public DriverEntity Driver { get; set; }
    
    public Guid DriverId { get; set; }

    public DateTime TimeStart { get; set; }

    public DateTime TimeEnd { get; set; }

    public int TraveledKM  { get; set; }

    public int ConsumptionLitersFuel { get; set; }
}