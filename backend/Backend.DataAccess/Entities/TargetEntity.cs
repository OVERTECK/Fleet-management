namespace Backend.DataAccess.Entities;

public class TargetEntity
{
    public required Guid Id { get; set; }

    public CarEntity Car { get; set; }

    public required string CarId { get; set; }

    public DriverEntity Driver { get; set; }

    public required Guid DriverId { get; set; }

    public required DateTime Start { get; set; }

    public required DateTime End { get; set; }
}