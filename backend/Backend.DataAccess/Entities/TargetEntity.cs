namespace Backend.DataAccess.Entities;

public class TargetEntity
{
    public Guid Id { get; set; }

    public CarEntity Car { get; set; }

    public string CarId { get; set; }
    
    public DriverEntity Driver { get; set; }
    
    public Guid DriverId { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }
}